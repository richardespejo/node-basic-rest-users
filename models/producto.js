const { Schema , model } = require('mongoose');

const ProductoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatoria'],
        unique : true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: { //hace referencia al otro modelo de USUARIO
        type: Schema.Types.ObjectId, //sentencia que apunta al otro modelo por tipado
        ref: 'Usuario',
        require: true
    },
    precio: {
        type: Number,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    descripcion: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true
    }

})

ProductoSchema.methods.toJSON = function(){
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model('Producto', ProductoSchema );