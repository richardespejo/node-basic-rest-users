const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivos , actualizarArchivos, mostrarImagen } = require('../controllers/uploads');
const { validarCampos, validarArchivo } = require('../middlewares'); //UNIFICA 3 ARCHIVOS EN UN MISMO DIRECTORIO INDEX.JS
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post( '/', validarArchivo ,cargarArchivos );

router.put( '/:coleccion/:id' , [
    validarArchivo,
    check('id','El id debe ser de tipo mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] )),
    validarCampos
] , actualizarArchivos);

router.get('/:coleccion/:id' ,[
    check('id','El id debe ser de tipo mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] )),
    validarCampos
], mostrarImagen)



module.exports = router;