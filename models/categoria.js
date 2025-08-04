const { Schema , model } = require('mongoose');

const CategoriaSchema = new Schema({
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
    usuario : { //hace referencia al otro modelo de USUARIO
        type: Schema.Types.ObjectId, //sentencia que apunta al otro modelo por tipado
        ref: 'Usuario',
        require: true
    }

})

CategoriaSchema.methods.toJSON = function(){
    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema );