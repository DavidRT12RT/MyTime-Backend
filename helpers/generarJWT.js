const jwt = require("jsonwebtoken");


const generarJWT = ( uid ) => {

    return new Promise((resolve, reject) => {
        const payload = { uid };//Que insertare en el JWT
        
        jwt.sign(payload,process.env.JWT_KEY,{
            expiresIn:"24h"
        },(err,token) => {
            if(err) return reject("No se pudo generar el JWT");
            return resolve(token);
        });
    })
}

module.exports = generarJWT;