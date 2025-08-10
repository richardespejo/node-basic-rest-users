const url = ( window.location.hostname.includes('localhost') ) ? 'http://localhost:3000/api/auth/' : 'http://richardespejo.com/api/auth/'

let usuario = null;
let socket = null;

//ReferenciaHTML
const txtUid    = document.querySelector('#txtUid'); 
const txtMensaje= document.querySelector('#txtMensaje');
const ulUsuarios= document.querySelector('#ulUsuarios');
const ulMensajes= document.querySelector('#ulMensajes');
const btnLogout = document.querySelector('#btnLogout');


const validarJwt = async() => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error("No hay toekn en el servidor");
    }

    const resp = await fetch( url , {
        headers : { 'Authorization' : token }
    });

    const { usuario: userDB , token: tokenDb } = await resp.json();
    localStorage.setItem('token',tokenDb);
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders': {
            'Authorization': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log(`socket Online`);
    });

    socket.on('disconnect', () => {
        console.log(`socket Offline`);
    });

    socket.on('recibir-mensajes', mostrarMensajes );
    socket.on('usuarios-activos', mostrarUsuarios );

    socket.on('mensaje-privado', (payload) => {
        console.log(`mensaje privado`,payload);
    });


}

const mostrarUsuarios = ( usuarios = [] ) => {

    let usuariosHTML = '';
    usuarios.forEach( ({nombre , uid }) => {
        usuariosHTML += `
            <li>
                <p>
                    <h5 class="text-success"> ${nombre}</h5>
                    <span class="fs-6 text-muted" >${uid}</span>
                </p>
            </li>
        
        `
    });
    ulUsuarios.innerHTML = usuariosHTML;

}

const mostrarMensajes = ( mensajes = [] ) => {

    let mensajesHTML = '';
    mensajes.forEach( ({nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-info"> ${nombre}</span>
                    <span >${mensaje}</span>
                </p>
            </li>
        
        `
    });

    ulMensajes.innerHTML = mensajesHTML;

}

txtMensaje.addEventListener( 'keyup' , ({keyCode}) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    
    if( keyCode !== 13 ) { return; }
    if( mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje , uid });

    txtMensaje.value = '';


})

const main = async() => {

    //Valida del JWT
    await validarJwt();
}


main();

//const socket = io();