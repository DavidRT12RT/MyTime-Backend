
const { Router } = require("express");

const { check } = require("express-validator");

//Controller's
const { crearUsuario, obtenerUsuarioPorId, obtenerUsuarios, obtenerImagenUsuario, actualizarInformacionUsuario } = require("../controllers/usuarios");

//Helper's
const { usuarioExistePorId } = require("../helpers/db_validators");

//Middleware's
const validarCampos = require("../middlewares/validarCampos");
const validarJWT = require("../middlewares/validarJWT");

const router = Router();

//Obtener todos los usuarios
router.get("/",obtenerUsuarios);

//Obtener usuario en particular
router.get("/:id",[
    validarJWT,
    check("id","El ID debe del usuario debe estar en la peticion").notEmpty(),
    check("id","El ID debe ser de mongoDB").isMongoId(),
    validarCampos
],obtenerUsuarioPorId);

//Obtener foto de perfil o header del usuario
router.get("/:id/fotos/",obtenerImagenUsuario);

//Crear un nuevo usuario
router.post("/",crearUsuario);

//Actualizar informacion usuario
router.put('/:id',[
    validarJWT,
    check('id','No es un ID valido!').isMongoId(),//Validacion propia de express validator 
    check('id').custom(usuarioExistePorId),
    validarCampos
],actualizarInformacionUsuario);


module.exports = router;