const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generateJWT');

const login = async(req, res = response ) => {

    const { correo, password } = req.body;

    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //Verificar si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario no esta activo'
            });
        }

        //Verificar la contraseña
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        //Genrar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Comunicarse con el administrador'
        })
    }


}

module.exports = login;