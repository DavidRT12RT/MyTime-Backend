const jwt = require("jsonwebtoken");

const verificarJWT = (token = "") => {

    try {
        const { uid } = jwt.verify(token,process.env.JWT_KEY);
        return [true,uid];
    } catch (error) {        
        return [false,null]
    }

}

module.exports = verificarJWT;