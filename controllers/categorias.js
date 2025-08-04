const { response } = require("express");
const { Categoria } = require('../models');


const obtenerCategorias = async(req, res = response) => {

    const {limit = 5 , desde = 0} = req.query;
    const status = {estado : true};
    
    const [ total, categorias] = await Promise.all([
        Categoria.countDocuments(status),
        Categoria.find(status)
            .populate('usuario','nombre')
            .skip(Number( desde ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        categorias
    })
}

const obtenerCategoriaId = async(req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json({
        categoria
    })
}

const crearCategoria = async (req , res = response) => {
    //recibo el dato y lo serializo a mayuscula
    const nombre = req.body.nombre.toUpperCase();
    //busco si existe el dato en la bd
    const categoriaDB = await Categoria.findOne({nombre});
    //si existe mando error
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }
    // si no preparo data para guardar a traves del modelo
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );
    //Guardo en BD
    await categoria.save();
    //retorno mensaje de guardado
    res.json(201).json({categoria});

}

const actualizarCategoria = async (req , res = response) => {

        const {id} = req.params;
        const { estado, usuario, ...data } = req.body;

        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuario._id;
    
        const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true} );
    
        res.json({
            categoria
        })
}

const eliminarCategoria = async (req , res = response) => {

        const { id } =  req.params;
        const categoria = await Categoria.findByIdAndUpdate(id, { estado : false});
    
        res.json({
            categoria
        })

}





module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaId,
    actualizarCategoria,
    eliminarCategoria
}