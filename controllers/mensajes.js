const { request,response } = require("express");
const Mensaje = require("../models/mensaje");


//Al ser controladores me permite tener la request y la response
const obtenerChat = async(req=request,res=response) => {

    try {
        const miId = req.uid;
        const mensajesDe = req.params.de;

        const last30 = await Mensaje.find({
            $or:[
                {de:miId,para:mensajesDe},
                {de:mensajesDe,para:miId}
            ]
        })
        .sort({createdAt:"asc"})
        .limit(30);

        return res.json({mensajes:last30});
    } catch (error) {
        console.log("Error");
        console.log(error);
        return res.status(500).json({msg:"Error obteniendo los mensajes de la DB"});
    }

}

const obtenerultimomensajechat = async(req=request,res=response) => {

    try {
        const miId = req.uid;
        const mensajesDe = req.params.de;

        const lastMessage = await Mensaje.findOne({
            $or:[
                {de:miId,para:mensajesDe},
                {de:mensajesDe,para:miId}
            ]
        })
        .sort({
            "createdAt":-1
        });

        if(!lastMessage) return res.status(404).json({msg:"Ningun mensaje encontrado!"});

        return res.json({lastMessage});

    } catch (error) {
        return res.status(500).json({msg:"Error obteniendo el ultimo mensaje"});
    }
}

module.exports = {
    obtenerChat,
    obtenerultimomensajechat
};