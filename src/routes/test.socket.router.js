import express from "express";      // SI usamos IMport tenes que especificar en el package.json, pero en el require no hace falta

export const testSocketRouter = express.Router();  // Para exportar con import/export, solo basta escribir "export" al principio. si colocamos userRoute entre llaves, exportamos el objeto.

testSocketRouter.get("/", (req, res) => {     
    return res.render("test-socket", {});
    /* return res.status(200).json({
        status: "succes",
        message: "Listado de pets",
        data: pets,
    }); */
});