//Rutas que tengan que ver con la autenticacion
const { Router } = require("express");
const { check } = require("express-validator");

//Middlewares
const validarJWT = require("../middlewares/validarJWT");
const validarCampos = require("../middlewares/validarCampos");

//Controllers
const { iniciarSeccion, renovarToken } = require("../controllers/auth");

const router = Router();

//Login
router.post("/login",[
    check("email","El email es obligatorio!").isEmail(),
    check("password","El password es obligatorio!").notEmpty(),
    validarCampos
],iniciarSeccion);

//Renovar token
router.get("/renew",validarJWT,renovarToken);

module.exports = router;

/* NOTAS:
    1.-Si enviamos 3 parametros al router le estamos diciendo que 
    el primero parametro es la ruta, el segundo es una 
    coleccion de middlewares y el tercero es la funcion 
    o controlador de la ruta

    2.-El check de express-validator por si mismo no para la ejecucion
    si no que crea una propiedad en el objeto request (req) llamado
    errors

    3.-El express al ser un middleware que esta entre los 
    corchetes este le pasa varios argumentos a la funcion 
    como lo son la request y la response asi como una 
    funcion llamada next la cual es encargada de llamar al 
    siguiente parametro si todo esta bien
*/
