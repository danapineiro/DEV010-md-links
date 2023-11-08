// Se obtiene la ruta del archivo
// import
//const fnApp = require("./lib/app.js");
const { getURLStatus, transformRoute, routeExists, extractMarkdownLinks, isMarkdownFile, readMarkdownFile, isUrlValid } = require("./lib/app.js");
const readline = require("readline");
const fs = require("fs");



// empieza promesa
// Definición de la función mdLinks que verifica y resuelve rutas
const mdLinks = (route, validate) => new Promise((resolve, reject) => {
    console.log('------------------------------------------', process.argv[2])
    //console.log("Iniciando mdLinks con la ruta:", route);
    const absRoute = transformRoute(route); // Corregido el nombre de la variable
    //console.log("Ruta absoluta:", absRoute);

    if (routeExists(absRoute)) {
        //console.log("La ruta existe.");
        if (isMarkdownFile(absRoute)) {
            //console.log("Es un archivo Markdown válido.");
            // Leer el contenido
            readMarkdownFile(absRoute)
                .then(res => {
                    if (res !== null) {
                        const resultLink= [] // => respuesta final
                        //console.log("Contenido del archivo Markdown:", res);

                        const links = extractMarkdownLinks(res); // Agregar función para extraer enlaces
                        //console.log("Enlaces extraídos:", links, res);
                        if(validate){
                            const linksPromises = links.map(link => getURLStatus(link.href))
                            console.log({linksPromises})

                            Promise.all(linksPromises)
                            .then(res =>{
                                for (let i = 0; i < links.length; i++) {
                                    //Agregar elementos a la respuesta final
                                    const data ={
                                        text: links[i].text,
                                        url: links[i].href,
                                        statusCode: res[i].status,
                                        file: absRoute,
                                        status: typeof res[i].status === 'string' ? 'Fail' : 'OK',
                                    }
                                    resultLink.push(data)  
                                }
                                console.log('RESULT==============================>', resultLink)
                            })
                            .catch(error => console.log({ error }))
                        }
                        else{
                            console.log('RESULT==============================>', links)
                        }
                }
                })
                .catch(error => {
                    console.log("function mdlinks :", error)
                    reject(error);
                });

        } else {
            reject("Archivo inválido, prueba con un archivo md".red);
        }
    } else {
        reject("Tu ruta no existe, prueba con otra".red);
    }
});
//termina promesa

const route = "./examples/README.md";
//C:\Users\lapto\Documents\DEV010-md-links\examples\README.md
//const route = "./examples/examples.js";
mdLinks(route, process.argv[2])
    .then((res) => {
        console.log("MDLINKS: ", res);
    }).catch((err) => {
        console.log("MDLINKS ERROR: ",err);
    });
