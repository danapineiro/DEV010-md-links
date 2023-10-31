// Se obtiene la ruta del archivo
// import
//const fnApp = require("./lib/app.js");
const { getURLStatus, transformRoute, routeExists, isMarkdownFile, readMarkdownFile, isUrlValid } = require("./lib/app.js");
const readline = require("readline");
const fs = require("fs");

// Definición de la función mdLinks que verifica y resuelve rutas
const mdLinks = (route) => new Promise((resolve, reject) => {
    const asbRoute = transformRoute(route);
    if (routeExists(asbRoute)) {
        if (isMarkdownFile(asbRoute)) {
            // Leer el contenido
            const markdownContent = readMarkdownFile(asbRoute);
            if (markdownContent !== null) {
                console.log(isUrlValid(markdownContent));
                resolve(markdownContent);
                const reader = readline.createInterface({
                    input: fs.createReadStream(asbRoute) // Corregido el typo en "createReadStream"
                });
                reader.on("line", function (line) {
                    const isUrl = isUrlValid(line);
                    if (isUrl) {
                        getURLStatus (line).then((response) => { console.log(response); })
                            .catch((e) => console.log(e));
                    }
                });
            } else {
                reject("Archivo vacío, prueba con otro".red);
            }
        } else {
            reject("Archivo inválido, prueba con un archivo md".red);
        }
    } else {
        reject("Tu ruta no existe, prueba con otra".red);
    }
});

    
// 1: Verifica si la ruta proporcionada es absoluta
// if (path.isAbsoluteRoute(route)) {
//     // 2: Si es absoluta, resuelve la promesa con la misma ruta
//     resolve(route); 
// } else {
//     // 3: Si la ruta no es absoluta, intenta resolverla
//     const absolutePath = path.resolve(route);

//     // 4: Verificar si la ruta resuelta existe en el sistema
//     if (fs.existsSync(absolutePath)) {
//     // Si existe, resuelve la promesa con la ruta absoluta resultante
//         resolve(absolutePath);
//     } else {
//     // Si no se puede resolver la ruta, rechaza la promesa con un mensaje de error
//         reject("La ruta no es valida o no existe en el sistema");
//     }
// }
// Imprime la definición de la función mdLinks en la consola
// console.log("Función mdLinks aloja mi promesa");
// console.log(mdLinks);
const route = "./examples/README.md";
//C:\Users\lapto\Documents\DEV010-md-links\examples\README.md
//const route = "./examples/examples.js";
mdLinks(route).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
});




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