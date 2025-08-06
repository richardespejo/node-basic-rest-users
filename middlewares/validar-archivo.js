const { response } = require("express");

const validarArchivo = (req, res = response , next) => {


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No hay archivos para subir. - validarArchivo');
    }

    next();
}

module.exports = {
    validarArchivo
}