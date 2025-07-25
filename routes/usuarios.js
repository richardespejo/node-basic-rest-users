const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const { validarCampos, validarJWT, esAdminRole, tieneRole } = require('../middlewares'); //UNIFICA 3 ARCHIVOS EN UN MISMO DIRECTORIO INDEX.JS

const { esRoleValido, existeCorreo, existeUsuarioPorId} = require('../helpers/db-validators');


const router = Router();
    //router.<Method>(<path>,<middleware, validators, etc>,<controller>)M
    router.get('/', usuariosGet );

    router.put('/:id', [
        check('id', 'No es un Id válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRoleValido ),
        validarCampos
    ], usuariosPut );

    router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser mas de 6 caracteres').isLength({ min:6}),
        //check('correo', 'El correo no es válido').isEmail(),
        //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        check('correo').custom( existeCorreo ), //USANDO MIDDLEWARE DE DE-VALIDATOR
        check('rol').custom( esRoleValido ), //USANDO MIDDLEWARE DE DE-VALIDATOR
        validarCampos
    ] , usuariosPost );

    router.delete('/:id', [
        //esAdminRole,
        validarJWT,
        tieneRole('SUPER_ROLE','VENTAS_ROLE','TRIMP_ROLE'),
        check('id', 'No es un Id válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
    ],usuariosDelete );

    router.patch('/',usuariosPatch );


module.exports = router;