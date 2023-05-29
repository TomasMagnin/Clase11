import express from "express";
import {usersRouter} from "./routes/users.router.js";  // Importamos los endpoint usuarios
import {petsRouter} from "./routes/pets.router.js";  // Importamos los endpoint usuarios
import { usersHtmlRouter } from "./routes/users.html.router.js";
import { testSocketRouter } from "./routes/test.socket.router.js";
import { testSocketChatRouter } from "./routes/test.socket.chat.router.js";
import { __dirname } from "./utils.js";              // Importamos la variable __dirname, de la configuracion de MULTER para poder subir archivos, LA variable dirname, es una variable de Node con un path aboluto a la carpeta que le indicamos.
import path from "path";
import handlebars from "express-handlebars";
import { Server } from "socket.io";                  // Importamos el servidor Socket.

// PARA INSTALAR HANDLEBAR ES NPM I EXPRESS-HANDLEBARS
// Para INSTALAR SOCKET ES NPM I SOCKET.IO

/*  Pasos para usar Socket */
// 1) Instalaar Socket
// 2) Metemos en una variable el servidor http. EJ: const httpServer =  app.listen(port, () => {
// 3) Metemos en una variable el servidor Socket, y le pasamos como parmetro la variable que contiene el servidor HTTP.   const socketServer = new Server(httpServer); 
// 4) Creamos una ruta para el servidor express con Handlebars + socket.io. app.use("/chat", chatRouter);
// 5) Creamos una ruta para testSocketRouter routes/test.socket.router.js, y la importamos en app.js import { testSocketRouter } from "./routes/test.socket.router.js";
// 6) Asociamos alguna de nuestras plantillas en routes. testSocketRouter.get("/", (req, res) => {return res.render("test-socket", {}), en este caso la plantilla se llama test-socket.
// 7) Instanciamos el cliente al socket. Ahora se crea una carpeta js en la carpeta public y  archivo JS. En nuestro archivo handlebars, instanciamos en una linea el socket y en otra el archivo js del paso amterior. El script de socket va primero.
// 8) Iniciamos nuestro servidor socket en la app socketServer.on("connection", (socket)=> { metemos los msg });
// 9) en el archivo index.js en la carpeta public(que seria el archivo js del front), tenemos que atajar lo que envia el back.

const app = express();          // Asignamos el servidor a una variable.
const port = 3000; 


/* --------- Middleware --------- */     // Son funciones intermedias entre el request de la peticion y el response del servidor para poder tomar acciones.

app.use(express.urlencoded({extended: true}));  // Declaramos que extendemos lo que recive por URL, para recivir datos complejos y porder mapearlos desde la URL.
app.use(express.json());        // Declaramos que el servidor utiliza formato JSON por defecto.

/* INICIOOO Configuracion de Handlebars */
app.engine("handlebars", handlebars.engine()); //Inicializamos el motor de plantilla. El engine de la app es el de handlebars.
app.set("views", path.join(__dirname, "views")); // Indicamos en que parte del proyecto se encuentran las vistas, usando la variable __dirname para usar rutas absolutas, seleccionado la carpeta(views) o archivo y no pifiarle a la direccion. El ultimo archivo es en que carpeta se encuentran las vistas.
app.set("view engine", "handlebars");      // Indicamos que el motor que ya inicializamos es el que vamos a utilziar por defecto.
/* FINNNN Configuracion de Handlebars */

app.use(express.static(path.join(__dirname, "public")));    // Tomamos la varible dirname de Node, que tiene el path absoluto, a la cartpea que especificamos.


// Rutas Api Rest con Json, nos retorna un JSON.
app.use("/api/users", usersRouter);  // Le decimos a la app, que use todo lo que esta en la ruta users, lo maneja userRouter.
app.use("/api/pets", petsRouter);  // Le decimos a la app, que use todo lo que esta en la ruta users, lo maneja petsRouter.


// Rutas HTML Render Server Side, nos retorna un HTML.
app.use("/users", usersHtmlRouter);

// Rutas Socket.
app.use("/test-socket", testSocketRouter);      // Todo lo que esta en la ruta URL test-socket, lo maneja testSocketRouter, que son todas las rutas que creamos para la URL, luego de test-Socket/xxxxxxxx.
app.use("/test-chat", testSocketChatRouter);

/* 
    Pasos a Seguir del chat

 Resusumen   Un usuario emite en msj del front al back, lo ataja el back con el socket.on que tiene ese nombre y replica el mensaje a todos los usuarios front menos el que envio.
    
        Front Emite
    1)  El front usuario emite un msj, socket.emit(front to back, xx)
        
        Back Ataja y Emite
    2)  El back ataja el mensaje socket.on(front to back, xx), y lo guarda en un array.  
        El back envia el msj que recivio a todos los front menos el que envio el msj.

        Front Ataja
    3)  El Front debe atajar el array de msj y mostrar en pantalla.
        Lo que no vamos hacer es, (evitar enviar msj a la misma persona que envio el msj, guardar una copia de array em front.)

        El back siempre recibe los mensajes individuales
        El Front recibe los mensajes de todos que reenvia el front
    
        Como funciona:
        vamos a la ruta app.use("/test-chat", testSocketChatRouter);, nos direcciona al router, y el router testSocketChatRouter, elije una vista("test-socket-chat") en la carpeta viewz y la renderiza,
        cuando se instancia la vista,  se inntancian los dos script de la libreria de socket y el script del front end en la carpeta public/js/index.js, cada 3 segundos emite un mensaje al back, el back 
        lo recive, lo guarda en el array y lo manda a todos los front y el front lo muestra en ka consola.

    4) Hacemos el deploy en Glitch con la opcion importar el proyecto desde Github.    
        Para hacer el deploy hay que especificar la version de node, "engines": {"node": "16.x"}
        */

// Ahora guardamos nuestro servidor HTTP en una variable
const httpServer =  app.listen(port, () => {
    console.log(__dirname);     // Verificamos la variable de forma global
    console.log(`App listen on port ${port}  http://localhost:3000/ `)}); // Le decimos al servidor en que puerto recivir las peticiones.

// Creamos en nuevo servidor de Socket y lo guardamos en una variable. Le pasamos al servidor de socket el servidor de HTTP.
// Toda la configuracion de a partir de esta linea es la del Backend.
const socketServer = new Server(httpServer);

let msgs = [];

/* socketServer.on es para cuando llega un Mensaje
socketServer.emit es para enviar un msj. */

socketServer.on("connection", (socket)=> {  // Cada vez que se crea y conecta un socket en el front para comunicar al back se creak un socket.
       
        // Back Emite
       /*  socket.emit("msj_back_to_front", {  // Emitirmos un msj al front, y el front lo escucha con el mismo nombre "msj_back_to_front".
            msg: Date.now() + "Hola desde el back hacia el socket(front)",
        }); */
    
        // 2)
        // Back Recibe 
        socket.on("msg_front_to_back", (msg) => {    // Recivimos lo que emitio front, el nombre tiene que ser igual que el del emit del front para escucharlo en este caso "msj_front_to_back".
            console.log(msg);   // Este log lo vemos en el eitor de texto.
            if(msgs.length == 10) {
                msgs = [];
            }
            msgs.unshift(msg);
            // Cuando respondemos con socketServer les respondemos a todos los socket, a diferencia de usar socket solametne,
            socketServer.emit( "msg_back_to_front", msgs ); //Le enviamos un mensaje a todos
        });




           // Este es un ejemplo para un chat, donde se distribuye el msj a todos los usuarios, menos el que envio.
       /*  socket.broadcast.emit("msj_back_to_todos_menos_socket", {   
            msj: "Hola desde el back a todos menos al socket",
        });
 
        
        socketServer.emit("msj_back_todos", {msj: "Hola desde el back a todos"}); //Le enviamos un mensaje a todos */

    
    //le enviamos un mensaje  desde el Back al Front

   
});



app.get("*", (req, res) => {    // Si no machea con ninguna ruta entra a esta middleware default.
    return    res.status(400).json({
        status: "error",        // Si sale bien seria succes
        msj: "No se ecuentra ruta URL !!", 
        data: {},               // En caso positivo sera la data.
    });
});




/* ------------ MULTER Es una libreria para poder subir fotos  ------------ */

// Para usar Multer intalamso esta dependencia npm i multer.
// Luego creamos un archivo UTIL, para poner funciones auxiliares o utilitarias
// Continuamos en el archivo utils.js