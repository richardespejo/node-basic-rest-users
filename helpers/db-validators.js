const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}

const existeCorreo = async(correo = '') => {
    const existeCorreo = await Usuario.findOne({ correo });
    if( existeCorreo ){
        throw new Error(`El correo: ${correo}, ya esta registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ){
        throw new Error(`El id: ${id}, no existe`);
    }
}

const existeCategoria = async( id ) => {

    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria ){
        throw new Error(`La categoria con el id: ${id}, no existe`);
    }
}

const existeProducto = async( id ) => {

    const existeProducto = await Producto.findById(id);
    if( !existeProducto ){
        throw new Error(`El prodcuto con el id: ${id}, no existe`);
    }
}

const coleccionesPermitidas = async( coleccion = '' , colecciones = [] ) => {

    const incluida = colecciones.includes(coleccion);
    if( !incluida ){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    existeCorreo,
    existeUsuarioPorId,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}