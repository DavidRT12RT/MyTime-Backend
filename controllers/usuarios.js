const path = require("path");
const fs = require("fs");

const { request,response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const generarJWT = require("../helpers/generarJWT");
const { subirArchivo } = require("../helpers/subirArchivo");

const crearUsuario = async(req=request,res=response) => {
    try {
        const { email,password } = req.body;

        //Verificar que no existe el email
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail) return res.status(400).json({msg:"Email ya existente!"});

        //Generar la instancia de mi usuario
        const usuario = new Usuario(req.body);

        //Encriptar contrasena!
        const salt = bcrypt.genSaltSync();//Cantidad devueltas para encriptar contrasena
        usuario.password = bcrypt.hashSync(password,salt);

        //Grabar en DB
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id);

        return res.status(201).json({msg:"Usuario creado!",usuario,token});

    } catch (error) {
        return res.status(500).json({msg:"Error creando el usuario en el servidor!"});
    }
}

const obtenerUsuarioPorId = async(req=request,res=response) => {

    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if(!usuario) return res.status(404).json({msg:"Usuario NO existe!"});
    
    return res.json(usuario);

}

const obtenerImagenUsuario = async(req=request,res=response) => {

    const { id } = req.params;
    let { tipo } = req.query;

    const usuario = await Usuario.findById(id);
    if(!usuario) return res.status(404).json({msg:"Usuario NO encontrado!"});

    let ruta;

    //Si la imagen es de algun tipo especial
    if(tipo == "perfil" || tipo == "header"){
        ruta = path.join(__dirname,`../uploads/usuarios/${id}/fotos/${tipo}/${usuario[tipo]}`);
    }

    if(!fs.existsSync(ruta)) ruta = path.join(__dirname,`../uploads/usuarios/${tipo}.jpg`)
    
    return res.sendFile(ruta);

}

const obtenerUsuarios = async(req=request,res=response) => {
    return res.status(200).json({
        msg:"Obtener usuarios"
    });
}

const actualizarInformacionUsuario = async(req,res=response)=>{

    const { id } = req.params;//const id = req.params.id;

    const {correo,telefono,nombre,descripcion,...resto} = req.body;

    const usuario = await Usuario.findById(id);
   
    usuario.telefono = telefono;
    usuario.correo = correo;
    usuario.nombre = nombre;
    usuario.descripcion = descripcion;

    //Cambiamos perfil del usuario SI viene
    if(req?.files?.perfil){
        try {
            const perfil = await subirArchivo({archivo:req.files.perfil},undefined,`/usuarios/${id}/fotos/perfil/`);
            usuario.perfil = perfil;
        } catch (error) {
            return res.status(500).json({msg:"Fallo en el servidor al momento de actualizar la foto de perfil"});
        }
    }

    //Cambiamos header del usuario SI viene
    if(req?.files?.header){
        try {
            const header = await subirArchivo({archivo:req.files.header},undefined,`/usuarios/${id}/fotos/header/`);
            usuario.header = header; 
        } catch (error) {
            return res.status(500).json({msg:"Fallo en el servidor al momento de actualizar el header de perfil"});
        }
    }

    await usuario.save();
    return res.json({msg:"Cambios hechos con exito!",usuario});

}

module.exports = {
    crearUsuario,
    obtenerUsuarioPorId,
    obtenerUsuarios,
    obtenerImagenUsuario,
    actualizarInformacionUsuario
};