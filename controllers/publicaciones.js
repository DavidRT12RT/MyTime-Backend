//System
const fs = require("fs");
const path = require("path");

const { request,response } = require('express');

//Helpers
const { subirArchivo } = require("../helpers/subirArchivo");

//Models
const { Publicacion, Usuario } = require('../models');


const publicacionesGetTotales = async(req=request,res=response) => {

    try {
        
        let query = req.query;
        query = {...query,estado:true};
        const [ publicacionesTotales,publicaciones ] = await Promise.all([
            Publicacion.countDocuments(query),
            Publicacion.find(query)
                .populate("autor").sort({fecha:"-1"})
                .populate({
                    path:"reacciones.autor",
                    model:"Usuario"
                })
                .populate({
                    path:"comentarios.autor",
                    model:"Usuario"
                })
        ]);

        return res.status(200).json({msg:"Publicaciones encontradas!",publicaciones,publicacionesTotales});

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Fallo en el servidor buscando las publicaciones!"});
    }

}

const publicacionesUsuarioTotales = async(req=request,res=response) => {
    try {
        const { id } = req.params;

        const query = {
            autor:id,
            estado:true
        };
        const publicaciones = await Publicacion.find(query)
            .populate("autor").sort({fecha:"1"})
            .populate({
                path:"reacciones.autor",
                model:"Usuario"
            })
            .populate({
                path:"comentarios.autor",
                model:"Usuario"
            })
        
        return res.status(200).json({publicaciones});
    } catch (error) {
        return res.status(500).json({msg:`Error consiguiendo todas las peticiones del usuario con id ${id}`});
    }
}


const registrarNuevaPublicacion = async(req=request,res=response) => {

    try {
        const uid = req.uid;//Obtenemos el usuario que vaya a hacer la publicacion
        const data = req.body;
        if(Object.keys(data).length === 0) return res.status(400).json({msg:"Falta de informacion en la request"});//Usuario no mando informacion

        const publicacion = new Publicacion(data);
        publicacion.autor = uid;


        if(req.files){
            publicacion.contieneFotos = true;
            //Subir fotos al sistema en su carpeta recien creada
            for(const archivo in req.files){
                const nombre = await subirArchivo({archivo:req.files[archivo]},undefined,`publicaciones/${publicacion._id}/`);
                publicacion.fotos.push(nombre);
            }
        }

        await publicacion.save();//Guardando la publicacion en DB

        //Buscar el usuario para anadirle la publicacion 
        const usuario = await Usuario.findById(uid);
        if(!usuario) return res.status(404).json({msg:"Usuario NO encontrado"});
        usuario.publicaciones.unshift(publicacion._id);
        await usuario.save();

        return res.status(201).json({msg:"Publicacion creada con exito!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Error en el servidor al momento de crear publicacion"});
    }

}


const obtenerFotoPublicacion = (req=request,res=response) =>{
    const { id ,foto } = req.params;

    const imagen = path.join(__dirname,`../uploads/publicaciones/${id}/${foto}`);
    if(!fs.existsSync(imagen)) return res.status(404).json({msg:"Imagen NO encontrada en el sistema"});

    return res.sendFile(imagen);
}

const registrarAccionAPublicacion = async(req=request,res=response) => {

    try {
        const tipo = req.query.tipo;
        console.log(tipo);
        const { id } = req.params;

        const publicacion = await Publicacion.findById(id);
        if(!publicacion) return res.status(404).json({msg:"Publicacion NO encontrada!"});

        if(publicacion.estado === false) return res.status(403).json({msg:"Publicacion desabilitada!"});

        let msg = "";

        switch(tipo){

            case "reaccion":
                //Comprobar si el usuario ya tiene el like en la publicacion o NO
                let contieneLike = false;
                publicacion.reacciones.forEach(reaccion => {
                    if (reaccion.autor == req.uid) contieneLike = true
                });

                if(contieneLike) {
                    //Se lo quitamos
                    const reacciones = publicacion.reacciones.filter(reaccion => JSON.stringify(reaccion.autor) != JSON.stringify(req.uid));
                    publicacion.reacciones = reacciones;
                    msg = "Reaccion eliminada de la publicacion!";
                }else{
                    //Se lo anadimos
                    if(!req.body.reaccion) return res.status(400).json({msg:"Ninguna reaccion en la peticion!"});
                    const reaccion = {
                        autor:req.uid,
                        reaccion:req.body.reaccion
                    }
                    publicacion.reacciones.unshift(reaccion);
                    msg = "Reaccion registrada en la publicacion con exito!"
                }

                break;

            case "comentario":
                if(!req.body.comentario) return res.status(400).json({msg:"Ningun comentario en la peticion!"});
                const comentario = {
                    autor:req.uid,
                    comentario:req.body.comentario
                };
                publicacion.comentarios.unshift(comentario);
                msg = "Comentario registrado en la publicacion con exito!"
                break;

            default:
                return res.status(400).json({msg:"Accion no determinada!"});
        }

        await publicacion.save();
        return res.status(200).json({msg});       
    } catch (error) {
        return res.status(500).json({msg:"Error en el servidor al momento de registrar la accion,contacta a David"});
    }

}

const editarPublicacion = (req=request,res=response) => {

}

const eliminarPublicacion = async(req=request,res=response) => {

    try {
        const id = req.uid;
        const publicacion = Publicacion.findById(id);
        console.log(publicacion.author);
        console.log(req.uid);
        if(publicacion.autor === id) {
            publicacion.estado = false;
            await publicacion.save();
            return res.status(200).json({msg:"Publicacion eliminada con exito!"});
        } else {
            return res.status(403).json({msg:"Publicacion no es de su propiedad!"});
        }
   } catch (error) {
        return res.status(500).json({msg:"Error en el servidor al momento de eliminar la publicacion,contacta a David"});
    }

}

module.exports = {
    publicacionesGetTotales,
    publicacionesUsuarioTotales,
    registrarNuevaPublicacion,
    obtenerFotoPublicacion,
    registrarAccionAPublicacion,
    editarPublicacion,
    eliminarPublicacion
};