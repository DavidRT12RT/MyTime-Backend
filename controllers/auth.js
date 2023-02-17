const { request,response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const generarJWT = require("../helpers/generarJWT");


const iniciarSeccion = async(req=request,res=response) => {

    try {
        
        const { email,password } = req.body;
        
        //Verificar que exista un usuario con ese correo
        const usuario = await Usuario.findOne({email});
        if(!usuario) return res.status(400).json({msg:"Usuario con ese correo NO encontrado!"});

        //Comparar la contrasena que vino 
        const validPassword = bcrypt.compareSync(password,usuario.password);
        if(!validPassword) return res.status(400).json({msg:"Usuario o contrasena incorrectos!"});

        //Generar JWT
        const token = await generarJWT(usuario.id);

        return res.json({msg:"Inicio de seccion con exito!",token,usuario});
    } catch (error) {
        return res.status(500).json({msg:"Fallo en el servidor al momento de iniciar secion!"});
    }

}

const renovarToken = async(req=request,res=response) => {

    const uid = req.uid;

    //Renovar JWT
    const token = await generarJWT(uid);

    //Obtener usuario
    const usuario = await Usuario.findById(uid);

    return res.json({token,usuario});
}



module.exports = {
    renovarToken,
    iniciarSeccion
};
