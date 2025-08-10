const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const { createServer } = require('http');
const { socketController } = require('../sockets/socketController');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app); //se crea el servidor http
        this.io = require('socket.io')(this.server); //se crea el servidor de socket

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
        }


        //Conectar a base de datos
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas
        this.routes();
        //sockets
        this.sockets();

    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use( cors() );

        //lectura y parseo
        this.app.use( express.json() );

        //directorio público
        this.app.use( express.static('public') );

        //Carga de Archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Forza a crear directorio o carpeta si no existe
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.usuarios, require('../routes/usuarios'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    sockets(){
        console.log(`Sockets`);
        this.io.on('connection' , ( socket ) => socketController( socket , this.io ) );
    }

    listen(){
        this.server.listen(this.port, () => console.log(`escuchando en el puerto http://localhost:${this.port}`));

    }
}

module.exports = Server;