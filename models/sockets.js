//Controller's
const { usuarioConectado, usuarioDesconectado, obtenerUsuarios, grabarMensaje } = require("../controllers/sockets");

//Middlewares
const verificarJWT = require("../helpers/verificarJWT");

//Models
const Publicacion = require("../models/publicacion");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {

            //Extrayendo la informacion del query
            const token = socket.handshake.query["x-token"];

            //Validando JWT
            const [ valido,uid ] = verificarJWT(token);

            if(!valido){
                console.log("Socket no identificado");
                return socket.disconnect();
            }

            //Marcar en la DB estado del usuario
            const usuario = await usuarioConectado(uid);

            //Unir al usuario a una sala de socket.io(Permite agrupar cualquier cantidad de personas a estas salas)
            socket.join(uid);//

            console.log("Cliente conectado!",usuario.nombre);

            //Emitir TODOS los usuarios conectados
            this.io.emit("lista-usuarios", await obtenerUsuarios());

            //Escuchar cuando un cliente manda un mensaje
            socket.on("mensaje-personal",async(payload) => {

                const mensaje = await grabarMensaje(payload);
                this.io.to(payload.para).emit("mensaje-personal",mensaje);
                //Emitir mensaje a la sala que tiene ese uid de la persona
                this.io.to(payload.de).emit("mensaje-personal",mensaje);
                //Emitir al de (Persona que lo envia)

            });

            socket.on("actualizar-publicacion", async (values) => {
                const { id } = values;
                const publicacion = await Publicacion.findById(id)
                    .populate("autor")
                    .populate({
                        path: "reacciones.autor",
                        model: "Usuario",
                    })
                    .populate({
                        path: "comentarios.autor",
                        model: "Usuario",
                    });
                this.io.emit("actualizar-publicacion", publicacion);
            });

            socket.on("disconnect",async() => {
                console.log("Cliente desconectado!");
                await usuarioDesconectado(uid);
                this.io.emit("lista-usuarios", await obtenerUsuarios());
            });
        
        });
    }


}


module.exports = Sockets;