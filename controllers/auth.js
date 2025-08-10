const { response, json } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');

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

        //Generar JWT
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

const googleSignIn = async( req, res = response ) => {
    const id_token  = req.body.body.id_token;

    try {
            const {nombre, correo, img} = await googleVerify(id_token);

            let usuario = await Usuario.findOne({ correo });

            if(!usuario) {
                //Creo el usuario
                const data = {
                    nombre,
                    correo,
                    password: '123456789',
                    img,
                    google: true,
                    rol: 'USER_ROLE'
                };

                usuario = new Usuario( data );
                await usuario.save();
            }

            //si el usuario esta en DB
            if( !usuario.estado ){
                return res.status(401).json({
                    msg: 'El usuario esta bloqueado, contactar con administrador'
                });
            }

            //Genrar JWT
            const token = await generarJWT( usuario.id );


            res.json({
                msg: 'Todo id_token bien',
                usuario,
                token
            })
    } catch (error) {
        console.log(`error`,error);
        res.status(400).json({
            ok: false,
            msg: 'El token id no se pudo verificar'
        })
    }

}


const renovarToken = async( req , res = response) => {

        const { usuario } = req;

        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

}

module.exports = {
    login,
    googleSignIn,
    renovarToken
};