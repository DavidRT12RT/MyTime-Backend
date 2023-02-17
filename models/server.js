// Servidor de Express
const express    = require('express');
const http       = require('http');
const socketio   = require('socket.io');
const path       = require('path');
const cors       = require('cors');
const fileUpload =  require('express-fileupload');

const Sockets      = require('./sockets');
const dbConnection = require('../database/config');

class Server {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;

        //Conectar a DB
        dbConnection();

        //Paths endpoints
        this.paths = {
            login:"/api/auth",
            mensajes:"/api/mensajes",
            usuarios:"/api/usuarios",
            publicaciones:"/api/publicaciones"
        };

        // Http server (Se crea apartir del servidor creado con express)
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { /* configuraciones */ } );
    }

    middlewares() {

        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );

        //CORS(Configurar quien puede hacer peticion)
        this.app.use(cors())
        
        //JSON(Tomar el body y serializarlo como un JSON(parseo))
        this.app.use(express.json());

        this.app.use(
            fileUpload({
                useTempFiles:true,
                tempFileDir:"/tmp/",
                createParentPath:true//Creara la carpeta padre si el recurso que pide no la tiene
            })
        );

        
        //API ENDPOINTS
        this.app.use(this.paths.login,require("../routes/auth"));
        this.app.use(this.paths.mensajes,require("../routes/mensajes"));
        this.app.use(this.paths.usuarios,require("../routes/usuarios"));
        this.app.use(this.paths.publicaciones,require("../routes/publicaciones"));

        //Haciendo que cualquier ruta que llegue sirva el directorio publico donde esta la appa de react de una vez
        this.app.use("*", express.static("public"));
    }

    // Esta configuración se puede tener aquí o como propieda de clase
    // depende mucho de lo que necesites
    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }

}


module.exports = Server;