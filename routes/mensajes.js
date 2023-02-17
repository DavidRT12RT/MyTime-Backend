const { Router } = require("express");

//Middlewares
const validarJWT = require("../middlewares/validarJWT");

//Controllers
const { obtenerChat, obtenerultimomensajechat } = require("../controllers/mensajes");

const router = Router();

router.get("/:de",validarJWT,obtenerChat);

router.get("/ultimoMensaje/:de",validarJWT,obtenerultimomensajechat);

module.exports = router;