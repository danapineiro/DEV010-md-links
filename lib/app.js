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
        const file = match[3];

        links.push({ text, href, file}); // Agrega el enlace al array de enlaces encontrados.
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
        return axios.get(url)
            .then((response) => {
                return ({
                    url,
                    status: response.status,
                    ok: "ok",
                });
            })
            .catch((error) => {
                // console.log("getURLStatus error :", error)
                // console.log("AQUI ", error)
                //TRUTHY 
                if (!error?.response) {
                    return ({
                        url,
                        status: 400,
                        ok: "fail",
                    });
                } else {
                    return ({
                        url,
                        status: 400,
                        ok: "fail",
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