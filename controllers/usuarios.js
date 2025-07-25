const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = (req,res) => {
    
    //const queryParams = req.query;
    const { q, nombre = 'No name' , apiKey, page = 1, limit = 5} = req.query;

    res.json({
        msg:'api get -  controlador',
        q,
        nombre,
        apiKey,
        page,
        limit
    });
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
    const {id} = req.params.id;
    const { password , google, correo, ...body } = req.body;

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

const usuariosDelete = (req,res) => {
    res.json({
        msg: 'delete Api'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}