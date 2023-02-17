const jwt = require('jsonwebtoken');


//Como es un middleware tendremos acceso al req,res,next gracias a express-validator
const validarJWT = (req,res,next) => {
    try {
        const token = req.header("x-token");

        if(!token) return res.status(401).json({msg:"No hay token en la peticion!"});

        //Verifcar JWT
        const payload = jwt.verify(token,process.env.JWT_KEY);
        //Si se logra generar el payload mandamos a llamar el next
       
        //Dado que en otras pantallas necesitaremos el uid del usuario lo grabamos en el objeto de la request
        req.uid = payload.uid;

        next();
    } catch (error) {
        return res.status(401).json({msg:"Token NO valido!"});
    }
}


module.exports = validarJWT;