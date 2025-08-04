const { response } = require("express");
const { Producto } = require('../models');


const obtenerProductos = async(req, res = response) => {

    const {limit = 5 , desde = 0} = req.query;
    const status = {estado : true};
    
    const [ total, productos] = await Promise.all([
        Producto.countDocuments(status),
        Producto.find(status)
            .populate('categoria')
            .skip(Number( desde ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        productos
    })
}

const obtenerProductosId = async(req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id).populate('categoria');

    res.json({
        producto
    })
}

const crearProducto = async (req , res = response) => {
    const { estado, usuario, nombre, ...body } = req.body;
    //busco si existe el dato en la bd
    const productoDB = await Producto.findOne({nombre});
    //si existe mando error
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }
    // si no preparo data para guardar a traves del modelo
    const data = {
        ...body,
        nombre: nombre,
        usuario: req.usuario._id
    }

    console.log(data);
    const producto = new Producto( data );
    //Guardo en BD
    await producto.save();
    //retorno mensaje de guardado
    res.json(201).json({producto});

}

const actualizarProducto = async (req , res = response) => {

        const {id} = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuario._id;
    
        const producto = await Producto.findByIdAndUpdate( id, data, {new: true} );
    
        res.json({
            producto
        })
}

const eliminarProducto = async (req , res = response) => {

        const { id } =  req.params;
        const producto = await Producto.findByIdAndUpdate(id, { estado : false});
    
        res.json({
            producto
        })

}





module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductosId,
    actualizarProducto,
    eliminarProducto
}