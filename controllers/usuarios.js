const { response } = require('express');

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

const usuariosPost = (req,res) => {
    const body = req.body;
    res.json({
        msg: body
    })
}

const usuariosPut = (req,res) => {
    const idusuario = req.params.id;

    res.json({
        idusuario: idusuario
    })
}

const usuariosPatch = (req,res) => {
    res.json({
        msg: 'patch Api'
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