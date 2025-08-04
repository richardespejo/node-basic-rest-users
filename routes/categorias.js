const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT, esAdminRole } = require('../middlewares'); //UNIFICA 3 ARCHIVOS EN UN MISMO DIRECTORIO INDEX.JS
const { crearCategoria, obtenerCategorias, obtenerCategoriaId, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoria } = require('../helpers/db-validators');


const router = Router();
    
router.get('/', obtenerCategorias );

router.get('/:id', [
    check('id', 'no es un ID Mongo Válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoriaId);

router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria );

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoria ),
    validarCampos
],actualizarCategoria);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
] , eliminarCategoria);


module.exports = router;