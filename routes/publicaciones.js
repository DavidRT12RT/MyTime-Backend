//Third party imports
const { Router } = require('express');

//Middlewares
const validarJWT = require('../middlewares/validarJWT');

//Controllers
const { publicacionesGetTotales, registrarNuevaPublicacion, obtenerFotoPublicacion, registrarAccionAPublicacion, editarPublicacion, eliminarPublicacion } = require('../controllers/publicaciones');

const router = Router();

//Obtener TODAS las publicaciones del sistema
router.get("/",[
    validarJWT
],publicacionesGetTotales);

//Registrar una nueva publicacion en el sistema
router.post("/",[
    validarJWT
],registrarNuevaPublicacion);

//Obtener foto de una publicacion en el sistema
router.get("/:id/fotos/:foto",obtenerFotoPublicacion);

//Agregar LIKE,COMENTARIO Y COMPARTIR a una publicacion
router.put("/:id/registrarAccion/",[validarJWT],registrarAccionAPublicacion);

//Editar publicacion (Solo el creador de la publicacion puede hacer esto)
router.put("/:id/editar",[validarJWT],editarPublicacion);

//Eliminar publicacion y sus archivos(Si es que tiene claro)
router.delete("/:id/",[validarJWT],eliminarPublicacion);

module.exports = router;