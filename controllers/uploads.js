const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require('../models');


const cargarArchivos = async(req, res = response) => {

    try {

        //const fileName = await subirArchivo(req.files, ['pdf','txt'], 'pruebas'); //Se envia el nombre de la carpeta a crear
        const fileName = await subirArchivo(req.files, ['pdf','txt']);

        res.json({
            msg: 'Archivo subido exitosamente',
            fileName
        })
        
    } catch (msg) {
        res.status(500).json({msg})
    }
}


const actualizarArchivos = async( req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    })
                }
            break;
        case 'productos':
                modelo = await Producto.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
            break;
        default:
            return res.status(500).json({ msg: 'hay que validar'})
    }

    //Limpiar imagenes previas
    if( modelo.img ){
        //Borrar la imagen del servidor
        const pathImagen = path.join( __dirname , '../uploads' , coleccion , modelo.img );
        if( fs.existsSync( pathImagen )){
            fs.unlinkSync( pathImagen ); //aqui se borra la imagen con el unlinkSync del filesistem
        }
    }


    const nombre = await subirArchivo(req.files, undefined , coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    })
}


const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
                modelo = await Usuario.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${id}`
                    })
                }
            break;
        case 'productos':
                modelo = await Producto.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${id}`
                    })
                }
            break;
        default:
            return res.status(500).json({ msg: 'hay que validar'})
    }

    if( modelo.img ){
        const pathImagen = path.join( __dirname , '../uploads' , coleccion , modelo.img );
        if( fs.existsSync( pathImagen )){
            return res.sendFile( pathImagen )
        }
    }

    const imageNotFound = path.join( __dirname , '../assets/no-image.jpg');
    res.sendFile( imageNotFound );

}


module.exports = {
    cargarArchivos,
    actualizarArchivos,
    mostrarImagen
}