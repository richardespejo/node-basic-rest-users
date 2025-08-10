const { Router } = require('express');
const { check } = require('express-validator');
const {login , googleSignIn, renovarToken } = require('../controllers/auth');
const { validarCampos , validarJWT } = require('../middlewares');


const router = Router();

router.post('/login', [
    check('correo','El correo es obligatorio').isEmail(),
    check('password','El contraseña es obligatorio').not().isEmpty(),
    validarCampos
] ,login);

router.post('/google', [
    check('id_token','El id token es necesario').not().isEmpty(),
] ,googleSignIn);


router.get('/', validarJWT , renovarToken )


module.exports = router;