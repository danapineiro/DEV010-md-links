// Se obtiene la ruta del archivo
// import
const path = require("./lib/app.js");
const fs = require("fs");

// Aqui la funcion mdLinks
// Definición de la función mdLinks que verifica y resuelve rutas
const mdLinks = (route) => new Promise((resolve, reject) => {
    // 1: Verifica si la ruta proporcionada es absoluta
    if (path.isAbsolute(route)) {
        // 2: Si es absoluta, resuelve la promesa con la misma ruta
        resolve(route);
    } else {
        // 3: Si la ruta no es absoluta, intenta resolverla
        const absolutePath = path.resolve(route);

        // 4: Verificar si la ruta resuelta existe en el sistema
        if (fs.existsSync(absolutePath)) {
        // Si existe, resuelve la promesa con la ruta absoluta resultante
            resolve(absolutePath);
        } else {
        // Si no se puede resolver la ruta, rechaza la promesa con un mensaje de error
            reject("La ruta no es valida o no existe en el sistema");
        }
    }
});
// Imprime la definición de la función mdLinks en la consola
console.log("Función mdLinks aloja mi promesa");
console.log(mdLinks);




/*const app = require ("./lib/app");
const path = require ("path");
const fs = require ("fs");

const mdLinks = (route) => {
    return new Promise ((resolve, reject) => {
        if (path.isAbsolute(route)){
            resolve(route);
        } else {
            const adsolutePath = path.resolve(route);
            fs.access(adsolutePath, (error) => {
                if (error) {
                    reject("La ruta no es valida.");
                } else {
                    resolve(adsolutePath);
                }
            });
        }
    });
};
module.exports = {
    mdLinks,
};*/