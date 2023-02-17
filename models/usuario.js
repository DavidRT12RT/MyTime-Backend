const { Schema,model } = require('mongoose');

const UsuarioSchema = Schema({
    
    nombre:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true,
        default:"Sin descripcion aun!"
    },
    perfil:{
        type:String
    },
    header:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    online:{
        type:Boolean,
        default:false
    },
    publicaciones:{
        type:[Schema.Types.ObjectId],
        ref:"Publicacion"
    },
});

UsuarioSchema.method("toJSON",function(){
    const { __v,_id, password,...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model("Usuario",UsuarioSchema);


/* Como las columnas de nuestras entidades en una DB relacional*/