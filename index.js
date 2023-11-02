// Se obtiene la ruta del archivo
// import
//const fnApp = require("./lib/app.js");
const { getURLStatus, transformRoute, routeExists, extractMarkdownLinks, isMarkdownFile, readMarkdownFile, isUrlValid } = require("./lib/app.js");
const readline = require("readline");
const fs = require("fs");

// Definición de la función mdLinks que verifica y resuelve rutas
const mdLinks = (route) => new Promise((resolve, reject) => {
    console.log("Iniciando mdLinks con la ruta:", route);
    const absRoute = transformRoute(route); // Corregido el nombre de la variable
    console.log("Ruta absoluta:", absRoute);

    if (routeExists(absRoute)) {
        console.log("La ruta existe.");
        if (isMarkdownFile(absRoute)) {
            console.log("Es un archivo Markdown válido.");
            // Leer el contenido
            readMarkdownFile(absRoute)
                .then(res => {
                    if (res !== null) {
                        console.log("Contenido del archivo Markdown:", res);

                        const links = extractMarkdownLinks(res); // Agregar función para extraer enlaces
                        console.log("Enlaces extraídos:", links, res);

                        const results = [];
                        console.log(isUrlValid(res));
                        resolve(res);

                        const reader = readline.createInterface({
                            input: fs.createReadStream(absRoute) // Corregido el tipo en "createReadStream"
                        });
                        reader.on("line", function (line) {
                            console.log("Línea leída:", line);
                            const isUrl = isUrlValid(line);
                            console.log("isUrl:---->", isUrl);
                            if (!isUrl) {
                                //console.log("URL válida:", line);
                                getURLStatus(line)
                                    .then((response) => {
                                        //console.log("URL:", line);
                                        console.log(response);
                                    })
                                    //results.push({ url: line, response });
                                    .catch((e) => console.log(e));
                            }
                        });

                        reader.on("close", function () { // Corregido el tipo en "close"
                            console.log("Cierre del lector de líneas.");
                            // Agregar los enlaces extraídos a los resultados
                            results.push(...links); // Integrar los enlaces
                            console.log("results====>", results);
                            resolve(results);
                        });
                    }
                })
                .catch(error => {
                    reject(error);
                });

        } else {
            reject("Archivo inválido, prueba con un archivo md");
        }
    } else {
        reject("Tu ruta no existe, prueba con otra");
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
mdLinks(route)
    .then((res) => {
        console.log(res);
    }).catch((err) => {
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