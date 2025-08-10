//Login tipo React.js
const miFormulario = document.querySelector('form');

const url = ( window.location.hostname.includes('localhost') ) ? 'http://localhost:3000/api/auth/' : 'http://richardespejo.com/api/auth/'

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();

    const formData = {};

    for( let elem of miFormulario.elements){

        if( elem.name.length > 0)
            formData[elem.name] = elem.value
    }

    console.log(`formData`,formData);

    fetch( url + 'login' , {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({msg , token}) => {
        if(msg){
            return console.error(msg);
        }

        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(`err`,err);
    })

})



function handleCredentialResponse(response){
    console.log('id_token', response.credential);
    //const responsePayload = decodeJwtResponse(response.credential);
    const body = { id_token : response.credential };

    /*
    fetch('http://localhost:3000/api/auth/google' , {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'         
        },
        body: JSON.stringify(body)
    })
    .then( resp => {
        console.log(resp);
    })
    .catch(
        console.warn()
    );
    */
    axios.post('http://localhost:3000/api/auth/google', { body })
        .then( response => {
            console.log(response.data);
            localStorage.setItem('nodeapp_email', response.data.usuario.correo);
            localStorage.setItem('token', response.data.token);
            window.location = 'chat.html';

        })
        .catch( error => {
            console.log(error);
        })
}

const button = document.getElementById('google_signout');

button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke( localStorage.getItem('nodeapp_email'), done => {
        localStorage.clear();
        location.reload();
    })
}