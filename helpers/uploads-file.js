const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files , extensionesVálidas = ['png','jpg','jpeg','gif'] , carpeta = '' ) => {

    return new Promise( (resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        //Validar extensión
        if( !extensionesVálidas.includes(extension)){
            return reject(`La extensión ${ extension } no es permitida, las permitidas son: ${ extensionesVálidas }`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        
        //uploadPath = path.join( __dirname , '../uploads/' , archivo.name )
        uploadPath = path.join( __dirname , '../uploads/' , carpeta , nombreTemp )

        archivo.mv(uploadPath, (err) => {
            if(err){
                reject(err);
            }
            resolve( nombreTemp );
        });

    });

}


module.exports = {
    subirArchivo
}