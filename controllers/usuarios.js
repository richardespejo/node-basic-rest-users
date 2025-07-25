const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = async(req,res) => {
    

    //const queryParams = req.query;
    const {limit = 5 , desde = 0} = req.query;
    const status = {estado : true};

    /*
    //Promesa 1
    const usuarios = await Usuario.find(status)
        .skip(Number( desde ))
        .limit(Number( limit ));

    //Promesa 2
    const total = await Usuario.countDocuments(status);

    res.json({
        total,
        usuarios
    });
    */

    //unifico todas las promesas en una LA RESPUESTA DEBE SER MAS RAPIDA
    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(status),
        Usuario.find(status)
            .skip(Number( desde ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        usuarios
    })


}

const usuariosPost = async(req,res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync( password, salt)
    
    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async(req,res) => {
    const {id} = req.params;
    const { __id, password , google, correo, ...body } = req.body;

    if( password ){
        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync( password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate( id, body );

    res.json({
        usuario
    })
}

const usuariosPatch = (req,res) => {
    res.json({
        msg: 'patch Api',
        id
    })
}

const usuariosDelete = async(req,res) => {

    const { id } =  req.params;

    //Borrado fisico
    //const usuario = await Usuario.findByIdAndDelete( id );

    //borrado logico
    const usuario = await Usuario.findByIdAndUpdate(id, { estado : false});

    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}