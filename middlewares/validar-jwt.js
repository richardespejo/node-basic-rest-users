const jwt = require('jsonwebtoken');
const { response, request } = require('express');
const Usuario = require('../models/usuario');


const validarJWT = async(req = request, res = response, next) => {


    const token = req.header('Authorization')
    console.log(token);

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        //const payload = jwt.verify( token, process.env.SECRETORPRIVATEKEY);
        //console.log(payload);

        const {uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        //leer al usuarui que corresponde el id
        const usuario = await Usuario.findById( uid );

        //Verificar si existe el usuario
        if(!usuario){
            return res.status(401).json({
                msg: 'token no valido - usuario no existe en bd'
            });
        }
        //verificar si el uai (usuario) esta activo 
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario no esta activo'
            });
        }
        req.usuario = usuario;


        next();
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })

    }

}

module.exports = {
    validarJWT
}

