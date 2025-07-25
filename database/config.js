const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNX);
        console.log('Base de datos Online');
        
    } catch (error) {
        console.log(`error en DB: `,error);
        throw new Error("Error al conectar a la BD");
        
    }

}

module.exports = {
    dbConnection
}