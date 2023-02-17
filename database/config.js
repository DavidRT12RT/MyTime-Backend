const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN_STRING,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("Coneccion a la base de datos exitosa!");
    } catch (error) {
        console.log(error);
        throw new Error("Error en la connecion a la base de datos!");
    }
}

module.exports = dbConnection;
