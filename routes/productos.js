const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares'); //UNIFICA 3 ARCHIVOS EN UN MISMO DIRECTORIO INDEX.JS
const { existeProducto, existeCategoria } = require('../helpers/db-validators');
const { obtenerProductosId, obtenerProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');


const router = Router();
    
router.get('/', obtenerProductos );

router.get('/:id', [
    check('id', 'no es un ID Mongo Válido').isMongoId(),
    check('id').custom(  existeProducto),
    validarCampos
], obtenerProductosId);

router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es una categoria ID Mongo Válido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
] , crearProducto );

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es una categoria ID Mongo Válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProducto );

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
] , eliminarProducto );


module.exports = router;