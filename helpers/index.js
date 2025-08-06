
const dbValidators = require('./db-validators');
const generarJWT = require('./generateJWT');
const googleVerify = require('./google-verify');
const subirArchivos = require('./uploads-file');


module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivos
}