/*  Una forma de trabajar correctamente con plantillas, conforme crece nuestro sitio web, es colocar las vistas
    como si fueran un router más de nuestro servidor */

import express from "express";      // SI usamos IMport tenes que especificar en el package.json, pero en el require no hace falta
export const usersHtmlRouter = express.Router();  // Para exportar con import/export, solo basta escribir "export" al principio. si colocamos userRoute entre llaves, exportamos el objeto.

let usuarios = [
    { id: 100, name: "momi", edad: 30 },
    { id: 200, name: "tato", edad: 40 },
    { id: 300, name: "nenu", edad: 50 },
    { id: 400, name: "mia", edad: 60 },
];

usersHtmlRouter.get("/", (req, res) => { 
    const usuario = { name: "Tomi", edad: 31, isAdmin: false };
    return res.status(200).render("usuario", { usuario, usuarios });    // Le madnamos dos objetos usuarios, le tenemos que especificar en la plantilla.
});

usersHtmlRouter.get("/all", (req, res) => { 
    return res.status(200).render("usuarios", { usuarios });    // Le madnamos dos objetos usuarios, le tenemos que especificar en la plantilla.
});