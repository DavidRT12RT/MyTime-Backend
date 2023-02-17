const { Usuario } = require('../models');

const usuarioExistePorId = async (id)=>{
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id ${id} NO existe!`);
    }
}

module.exports = {
    usuarioExistePorId
};