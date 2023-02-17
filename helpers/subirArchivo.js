const {v4:uuidv4} = require('uuid');
const path = require('path');

const subirArchivo = (
    files,
    extensionesValidas=['png','jpg','jpeg','gif','pdf'],
    carpeta='',
    processPath=false,
    cambiarNombre=true,
    validarExtension=true ) => {

    return new Promise((resolve,reject) => {
        
        const { archivo } = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];

        if(validarExtension){
            if(!extensionesValidas.includes(extension)) return reject(`La extension ${extension} NO es valida! ${extensionesValidas}`);
        }

        const nombreTemp = cambiarNombre ? (uuidv4()+'.'+extension) : archivo.name;

        //El path sera donde me encuentro , ruta,nombre
        const uploadPath = processPath ? (path.join(carpeta,nombreTemp)) : (path.join(__dirname,'../uploads/',carpeta,nombreTemp));

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err) return reject(err);
            resolve(nombreTemp);
        });

    });

}

module.exports = {
    subirArchivo
};
