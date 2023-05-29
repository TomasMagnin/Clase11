// Codigo de Front, para poder trabajar en el Frontend
// En socket siempre se transmiten JSON.
/* socket.on es para cuando llega un Mensaje
socket.emit es para enviar un msj. */

const socket = io();
let nombreUsuario = "";   // Creamos la variable global para agregar los nombres en el front.

async function pedirNombre() {     // Ceamos una funcion asyncrona  primero
  // Copiamos la configuracion de la libreria y lo adaptamos.
  const { value: nombre } = await Swal.fire({
    title: 'Enter your Name',
    input: 'text',
    inputLabel: 'Your Name',
    inputValue: "",
    showCancelButton: false,
    inputValidator: (value) => {
        if (!value) {   // Controlamos que el valor no siempre este vacio.
            return 'You need to write something!'
        }
    },
  });

  nombreUsuario = nombre;   // Guardamos el nombre ingresado
};

pedirNombre();

// Aca no existe el (req, res) por que es una comunicacion de dos vias,

// 1)
// Front Emite
 const chatBox = document.getElementById("chat-box");   // llamamos al ID de la caja y lo guardamos en esta variable.

 chatBox.addEventListener("keyup", ({ key }) => {   // Escuchamos cuando toquen la caja y sueltan la tecla la atramos la tecla y con el enter emitimos
   if (key == "Enter") {
    socket.emit("msg_front_to_back", {   // El clinte(Front) emite un tipo de mensaje msj que es un string.
      user: nombreUsuario,
      msg: chatBox.value,
    });
     chatBox.value = "";    // Ddejamos la caja vacia para volver a chatear
   }
 });

/*  setInterval(() => {
     socket.emit("msg_front_to_back", {   // El clinte(Front) emite un tipo de mensaje msj que es un string.
      msg: "msg " + Date.now(), 
      user: nombreUsuario,
    });
}, 3000); */



// 3)
// Front Recibe
socket.on("msg_back_to_front", (msgs) => {  // Atajamos los msjs que envia el Back, seria la (data).  El front no se refresca automatico.
  console.log(msgs);    // Este log lo vemos en la consola del Navegador.
  let msgFormateados = "";

  msgs.forEach((msg) => {
      msgFormateados += "<div style= 'border: 2px solid red;'>"
      msgFormateados += "<p>" + msg.user + "</p>"
      msgFormateados += "<p>" + msg.msg + "</p>"
      msgFormateados += "</div>"
  });
  const divMsgs = document.getElementById("div-msgs");  // Capturamos el elemento que tiene el id (div-msgs)
  divMsgs.innerHTML=  JSON.stringify(msgFormateados);  // Introducimos dentro del html que contiene el ID( id="div-msgs")
});

   
    





