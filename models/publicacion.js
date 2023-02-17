const { Schema, model } = require("mongoose");
const moment = require("moment");
const fecha = moment().locale("es").format("LLLL");

const publicacionSchema = Schema({
    descripcion:{
        type:String
    },
    autor:{
        type:Schema.Types.ObjectId,//Es decir otro objecto que tenemos de mongo
        ref:'Usuario',//tener referencia de mi otro schema
        required:true
    },
    contieneFotos:{
        type:Boolean,
        default:false
    },
    fotos:{
        type:[String]
    },
    fecha:{
        type:String,
        default:fecha
    },
    reacciones:{
        //De tipo array de objectos
        type:[
            {
                autor:{type:Schema.Types.ObjectId,ref:"usuario"},
                reaccion:{type:String},
                fecha:{type:String,default:fecha}
            }
        ]
    },
    comentarios:{
        type:[
            {
                autor:{type:Schema.Types.ObjectId,ref:"usuario"},
                comentario:{type:String},
                fecha:{type:String,default:fecha}
            }
        ]
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    editado:{
        type:Boolean,
        default:false
    }
});

publicacionSchema.toJSON = function(){
    const { __v,...publicacion } = this.toObject();
    return publicacion;
}

module.exports = model("Publicacion",publicacionSchema);