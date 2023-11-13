// Se obtiene la ruta del archivo
// import
//const fnApp = require("./lib/app.js");
const { getURLStatus, transformRoute, routeExists, extractMarkdownLinks, isMarkdownFile, readMarkdownFile, isUrlValid } = require("./lib/app.js");
const readline = require("readline");
const fs = require("fs");
//let colors = require("colors");


// empieza promesa
// Definición de la función mdLinks que verifica y resuelve rutas
const mdLinks = (route, validate) => new Promise((resolve, reject) => {
        // Imprimir la ruta que se está procesando
    console.log('------------------------------------------', process.argv[2])
    //console.log("Iniciando mdLinks con la ruta:", route);
        // Obtener la ruta absoluta
    const absRoute = transformRoute(route); // Corregido el nombre de la variable
    //console.log("Ruta absoluta:", absRoute);
    // Verificar si la ruta existe
    if (routeExists(absRoute)) {
        //console.log("La ruta existe.");
        // Verificar si es un archivo Markdown válido
        if (isMarkdownFile(absRoute)) {
            //console.log("Es un archivo Markdown válido.");
            // Leer el contenido del archivo Markdown
            readMarkdownFile(absRoute)
                .then(res => {
                    if (res !== null) { // verifica si la variable res no es null
                        const resultLink= [] // => Almacena la respuesta final
                        //console.log("Contenido del archivo Markdown:", res);
                        
                        // Extraer los enlaces del archivo Markdown
                        const links = extractMarkdownLinks(res); // Agregar función para extraer enlaces
                        //console.log("Enlaces extraídos:", links, res);

                        // Verificar si se debe realizar la validación de los enlaces
                        if(validate){

                            // Obtener el estado de cada enlace
                            const linksPromises = links.map(link => getURLStatus(link.href))
                             
                            // Imprimir las promesas de los enlaces
                            console.log({linksPromises})

                            // Resolver todas las promesas de los enlaces
                            Promise.all(linksPromises)
                            .then(res =>{
                                for (let i = 0; i < links.length; i++) {
                                    //Agregar elementos a la respuesta final
                                    // Construir el objeto de datos para cada enlace
                                    const data ={
                                        text: links[i].text,
                                        url: links[i].href,
                                        statusCode: res[i].status,
                                        file: absRoute,
                                        status: typeof res[i].status === 'string' ? 'Fail' : 'OK',
                                    }
                                    resultLink.push(data)  
                                }
                                // Imprimir la tabla con los resultados finales
                                console.table(resultLink)
                            })
                            .catch(error => console.log({ error }))
                        }
                        else{
                            // Resolver la promesa con los enlaces sin validación
                            resolve(links)
                            console.table(links)
                        }
                }
                })
                .catch(error => {
                    console.log("function mdlinks :", error)
                    reject(error);
                });

        } else {
            // Rechazar la promesa si el archivo no es válido
            reject("Archivo inválido, prueba con un archivo md".red);
        }
    } else {
        // Rechazar la promesa si la ruta no existe
        reject("Tu ruta no existe, prueba con otra".red);
    }
});
//termina promesa
//const route = "./README.md"; // readme grande
const route = "./examples/README.md"; // readme de prueba
//C:\Users\lapto\Documents\DEV010-md-links\examples\README.md // ruta real
//const route = "./examples/examples.js"; // prueba examples 2
mdLinks(route, process.argv[2])
    .then((res) => {
        console.log("MDLINKS: ", res);
    }).catch((err) => {
        console.log("MDLINKS ERROR: ",err);
    });
