import express from "express";      // SI usamos IMport tenes que especificar en el package.json, pero en el require no hace falta
import { ulploader } from "../utils.js";
export const petsRouter = express.Router();  // Para exportar con import/export, solo basta escribir "export" al principio. si colocamos userRoute entre llaves, exportamos el objeto.



let pets = [
    { id: 100, name: "lupe", edad: 30 },
    { id: 200, name: "gudy", edad: 40 },
    { id: 300, name: "negra", edad: 50 },
    { id: 400, name: "kika", edad: 60 },
];


petsRouter.get("/", (req, res) => {     
    return res.status(200).json({
        status: "succes",
        message: "Listado de pets",
        data: pets,
    });
});

// Para mandar un archivo, en POSTMAN seleccionamos body > form-data
petsRouter.post("/", ulploader.single("file"), (req, res) => {  // Cuando postean una foto nueva, primero se ejecuta la funcion de multer y depues saltamos ala funcion para crear el usuario
    const newPet = req.body;
    newPet.id = (Math.random()*1000000).toFixed(0).toString();     // Creamos un ID para el nuevo usuario
    newPet.picture = req.file.filename;
    pets.push(newPet);
    return res.status(201).json({
        status: "succes",
        message: "Pet creado",
        data: newPet,
    });
});