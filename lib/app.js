// Importa el módulo 'path' si no se ha importado previamente
const path = require("path"); // Trabaja con las rutas de archivos y directorios
const readline = require("readline");

const fs = require("fs");
const axios = require("axios"); //axios es una libreria para poder hacer llamadas HTTP

let colors = require("colors");
//const { log } = require("console");

// Definición de una función llamada transformRoute que resuelve una ruta relativa en una ruta absoluta

function transformRoute(route) {
    if (path.isAbsolute(route)) {
        return route;
    } else {
        return path.resolve(route);
    }
}

// Funcion para comprobar que la ruta existe

function routeExists(route) {
    try {
        fs.accessSync(route);
        return true; // La ruta existe
    } catch (error) {
        return false; // La ruta no existe
    }
}

// funcion para verificar si es archivo es markdown
const mdExtensions = [".md", ".mkd", ".mdwn", ".mdown", ".mdtxt", ".mdtext", ".markdown", ".text"];

function isMarkdownFile(filePath) {
    const fileExtension = path.extname(filePath);
    return mdExtensions.includes(fileExtension);
};


// funcion para verificar si lee el archivo md
function readMarkdownFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (error, content) => {
            if (error) {
                //console.error("Error al leer el archivo:", error);
                reject(error); // Rechazamos la promesa en caso de error.
            } else {
                //console.log("Content al leer el archivo:", content);
                resolve(content); // Resolvemos la promesa con el contenido del archivo.
            }
        });
    });
}

// funcion para extraer los md links
function extractMarkdownLinks(markdownContent) {
    //console.log("markdownContent ===>", markdownContent); // Imprime el contenido Markdown para depuración.
    const markdownLinkRegex  =  /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g; // Expresión regular para encontrar enlaces Markdown.
    const links = []; // Array donde se almacenarán los enlaces encontrados.
    let match;

    while ((match = markdownLinkRegex.exec(markdownContent)) !== null) {
        // Usando un bucle while y la función exec para encontrar todos los enlaces.
        //console.log("probando");
        const text = match[1]; // Captura el texto del enlace (lo que se muestra al usuario).
        const href = match[2]; // Captura la URL del enlace.

        links.push({ text, href }); // Agrega el enlace al array de enlaces encontrados.
    }
    
    return links; // Retorna un array de objetos que contienen el texto y la URL de los enlaces.
}

//funcion para ver si las url son validas

function isUrlValid(str) { //este es mi funcion de regex de validacion de URL que me retorna true or false segun sea el caso. 
    //console.log(str)
    const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IP (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", // fragment locator
        "i"
    );
    return urlPattern.test(str);
}

// funcion para traer el status code
const getURLStatus = (url) => { //pasar urls y revisar promesa
    // return new Promise((resolve, reject) => {
        return axios.get(url) // Tiempo de espera de 5 segundos
            .then((response) => {
                return ({
                    url,
                    status: response.status,
                });
            })
            .catch((error) => {
                // console.log("getURLStatus error :", error)
                if (error.response === "response.status") {
                    return ({
                        url,
                        status: response.status,
                    });
                } else {
                    return ({
                        url,
                        status: "Error: " + error.message,
                    });
                }
            });
};



// Exporta las funciones para que estén disponibles en otros módulos
module.exports ={
    //isAbsoluteRoute,
    transformRoute,
    routeExists,
    isMarkdownFile,
    readMarkdownFile,
    extractMarkdownLinks,
    isUrlValid,
    getURLStatus,
    colors
};

// pruebas
// No olvidar cambiar los errores a ingles :)
// Aquí empiezan mis funciones

// Definición de una función llamada isAbsoluteRoute que verifica si una ruta es absoluta
/*const isAbsoluteRoute = (route) => { 
    return path.isAbsolute(route); // Utiliza la función path.isAbsolute para realizar la verificación
};*/

// Prueba de que la ruta es absoluta
//const absolute ="/Users/Usuario/documentos/archivo.txt";
//console.log(isAbsoluteRoute(absolute));

// Prueba con una ruta absoluta
/*const routeAbsolute = "/Users/Usuario/documentos/archivo.txt";
const isAbsolute = isAbsoluteRoute(routeAbsolute);
console.log(`¿Es la ruta absoluta? ${isAbsolute}`.green); // Debería imprimir "¿Es la ruta absoluta? true"

// Prueba con una ruta relativa
const routeRelative = "./examples/README.MD";
const isAbsoluteTwo = isAbsoluteRoute(routeRelative);
console.log(`¿Es la ruta absoluta? ${isAbsoluteTwo}`.red); // Debería imprimir "¿Es la ruta absoluta? false"*/

// Prueba de que transforma la ruta
// const relativeRoute = "./examples/README.MD";
// const absoluteRoute = transformRoute(relativeRoute);
// console.log(`Ruta absoluta: ${absoluteRoute}`.rainbow); // Imprime en consola

// Prueba si existe la ruta, podemos cambiar una letra para que diga que la ruta no existe
// const route = "./examples/README.md";

// if (routeExists(route)) {
//     console.log(`La ruta ${route} existe en el computador.`.green);
// } else {
//     console.log(`La ruta ${route} no existe en el computador.`.red);
// }

// comprobamos si es un archivo markdown y podemos cambiar la extension
// para comprobar que si manda el error cuando no es markdown
// const file = "archivo.md";

// if(isMarkdownFile(file)){
//     console.log(`${file} es un archivo Markdown.`.green);
// } else {
//     console.log(`${file} no es un archivo Markdown.`.red);
// }

/*function readMarkdownFile(filePath){
    try {
        const content = fs.readFile(filePath, "utf8",(error,content) );
        return content;
    } catch (error){
        console.error(`Error al leer el archivo: ${error.message}`);
        return null;
    }
}*/

/*function readMarkdownFile(filePath) {

    fs.readFile(filePath, "utf-8", (error, content) => {
        // La función readFile recibe la ruta del archivo, la codificación (utf-8 en este caso)
        // y una función de devolución de llamada (callback) que maneja el resultado de la operación.
        if (error) {
            // Si hay un error al leer el archivo, se ejecuta esta parte del código.
            console.error("Error al leer el archivo:---->", error);
            return (error);
            // Se retorna el error para indicar que algo salió mal en la lectura del archivo.
        } else {
            // Si la lectura del archivo se realiza con éxito, esta parte se ejecuta.
            console.log("Content al leer el archivo:---->", content);
            return(content);
            // Se retorna el contenido del archivo leído.

        }
    });

}*/

/*function readMarkdownFile(filePath) {
    return fs.readFile(filePath, { encoding: "utf8" })
        .then(content => {
            return content;
        })
        .catch(error => {
            console.error(`Error al leer el archivo: ${error.message}`);
            return null;
        });
}*/

/*function readMarkdownFile(filePath) {
    return fs.readFile(filePath, "utf8")
        .then(content => {
            return content;
        })
        .catch(error => {
            console.error(`Error al leer el archivo: ${error.message}`);
            return null;
        });
}*/

// const filePath = "./examples/README.md"; 
// const markdownContent = readMarkdownFile(filePath);

// if (markdownContent !== null) {
//     console.log(markdownContent);

//prueba
/*const getURLStatus = (url) => new Promise((resolve, reject) => {
    console.log("URL de get=>>>>", url);
    axios.get(url)
        .then((response) => {
            // En caso de éxito, resolvemos con el código de estado
            resolve({
                url,
                status: response.status,
            });
        })
        .catch((error) => {
            // En caso de error, rechazamos con el código de estado si está disponible
            if (error.response) {
                reject({
                    url,
                    status: error.response.status,
                });
            } else {
                // Si no hay un código de estado disponible en el error, puedes asignar un valor predeterminado aquí si lo deseas
                reject({
                    url,
                    status: -1, // Valor predeterminado (puedes personalizarlo según tus necesidades)
                });
            }
        });
});*/

/*const getURLStatus = (url) => {
    console.log("URL de get=>>>>", url);
    return axios.get(url)
        .then((response) => {
            return {
                url,
                status: response.status,
            };
        })
        .catch((error) => {
            if (error.response) {
                return {
                    url,
                    status: error.response.status,
                };
            } else {
                return {
                    url,
                };
            }
        });
};*/

//original
/*const getURLStatus = (url) => new Promise((resolve, reject) => { //a la funcion is localfile le paso un array de URLS
    console.log("URL de get=>>>>", url);
    return axios.get(url) //con anxios.get hago la llamada GET a la URL . Esto guarda un array de promesas
        .then((response) => { //Si la respuesta es exitosa, construyo un object que contiene mi url y su estatus.code. ESTE 
            console.log('responseeeeeeeeeee', response);
            resolve({
                url,
                status: response.status,
            });
        })
        .catch((error) => { // si ese error regresa un objeto pero con status error
            //let statusCode = ;
            if (error.response) {
                // statusCode = error.response.status;
            }
            reject({
                error: error
            });
        });
    //resolve (Promise.all(promiseArray)); //una vez que las promesas se resuelven (resolve or reject),
    // a promise.all le paso el array de todas las promesas y promise.all me regresa una ùnica promesa .
    // Esta promesa devuelta se cumple cuando se cumplen todas las promesas de entrada, de lo contrario es rejected.
    // .then((data) => {
    //   resolve(data);
    // })
    //.catch(() => {
    // reject(new Error("No fue posible completar la acción debido a un error."));
    // });
});*/