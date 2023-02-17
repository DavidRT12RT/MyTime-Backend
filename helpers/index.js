

const verificarJWT = require("./verificarJWT");
const { subirArchivo } = require("./subirArchivo");

module.exports = {
    ...verificarJWT,
    ...subirArchivo
};



