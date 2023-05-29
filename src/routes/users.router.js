/* ---------  Router  --------- */

// Cuendo tenemos varios endpoints asosiciado a un mismo elemento, Ej: usuarios, creamos un Router.
// Creamos un archivo Router que va contener con todas mis rutas(ENDPOINTS), que va ser una mini app.
// paso final exportar router para poder usarlo en cualuier otro archivo de mi app. 
// Del nombre del archivo siempre toma el punto final de la extension.

import express from "express";      // SI usamos IMport tenes que especificar en el package.json, pero en el require no hace falta
export const usersRouter = express.Router();  // Para exportar con import/export, solo basta escribir "export" al principio. si colocamos userRoute entre llaves, exportamos el objeto.

let usuarios = [
    { id: 100, name: "momi", edad: 30 },
    { id: 200, name: "tato", edad: 40 },
    { id: 300, name: "nenu", edad: 50 },
    { id: 400, name: "mia", edad: 60 },
];

/* Ej-1 Handlebars */

/* usersRouter.get("/test", (req, res) => { 
    const datos = { name: "Tomi", edad: 31 };
//Hacemos un render de la vista Index, y le pasamos la variable usuarios para que arme la plantilla
    return res.status(200).render("pet", datos);  // El primer parametro de render es llamar, a nuetra pagina o plantilla, este caso la plantilla index, pero se peude llamar como querramos
    // return res.status(200).render("index", datos);   Ejemplo con plantilla index.
}); */

/* Ej-2 Handlebars- plantilla Pet */

usersRouter.get("/", (req, res) => { 
    const usuario = { name: "Tomi", edad: 31, isAdmin: false };
    return res.status(200).json({
        status: "success",
        msg: "listado de usuarios",
        data: usuarios,
      });
});


usersRouter.post("/",(req, res) => {
    const newUser = req.body;
    newUser.id = (Math.random()*1000000).toFixed(0).toString();     // Creamos un ID para el nuevo usuario
    usuarios.push(newUser);
    return res.status(201).json({
        status: "succes",
        message: "Usuario creado",
        data: newUser,
    });
});




