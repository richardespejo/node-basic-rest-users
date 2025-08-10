const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models/chat-mensajes');

const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket() , io ) => {

    const usuario = await comprobarJWT(socket.handshake.headers['authorization']);

    if( !usuario ){
        return socket.disconnect();
    }


    //Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr );
    socket.emit('recibir-mensajes' , chatMensajes.ultimos10 );

    //conectar a una sala especial
    socket.join( usuario.id );// global, socket.id , usuario.id

    //Limpiar cuando alguein se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr )

    });

    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if(uid){ //mensaje privado

            socket.to(uid).emit('mensaje-privado' , { de: usuario.nombre , mensaje})

        }else { //mensaje público

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensajes' , chatMensajes.ultimos10 );

        }
    })



}

module.exports = {
    socketController
}