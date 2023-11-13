// Importa el módulo 'path' si no se ha importado previamente
const path = require("path"); // Trabaja con las rutas de archivos y directorios
const readline = require("readline");

const fs = require("fs");
const axios = require("axios"); //axios es una libreria para poder hacer llamadas HTTP

let colors = require("colors");
//const { log } = require("console");

// Definición de una función llamada transformRoute que resuelve una ruta relativa en una ruta absoluta
/**
 * Transforma una ruta en una ruta absoluta.
 *
 * @param {string} route - La ruta de entrada a transformar.
 * @returns {string} - La ruta absoluta transformada.
 */
function transformRoute(route) {
    // Comprobar si la ruta ya es una ruta absoluta
    if (path.isAbsolute(route)) {
    // Si lo es, devolver la ruta tal como está
        return route;
    } else {
    // Si es una ruta relativa, resolverla para obtener la ruta absoluta
        return path.resolve(route);
    }
}

// Funcion para comprobar que la ruta existe
/**
 * Verifica si una ruta existe.
 *
 * @param {string} route - La ruta a verificar.
 * @returns {boolean} - true si la ruta existe, false si no.
 * Se usa el modulo fs para verificar la existencia de una ruta
 */
function routeExists(route) {
    try {
        // Intenta acceder sincrónicamente a la ruta
        fs.accessSync(route);
        // Si no se lanza una excepción, la ruta existe
        return true; // La ruta existe
    } catch (error) {
        // Si se lanza una excepción, la ruta no existe
        return false; // La ruta no existe
    }
}

// funcion para verificar si es archivo es markdown
// Extensiones de archivos Markdown válidas
const mdExtensions = [".md", ".mkd", ".mdwn", ".mdown", ".mdtxt", ".mdtext", ".markdown", ".text"];

/**
 * Verifica si un archivo tiene una extensión de Markdown.
 *
 * @param {string} filePath - La ruta del archivo a verificar.
 * @returns {boolean} - true si el archivo es de tipo Markdown, false si no.
 * extrae su extenson usando path.extname
 */
function isMarkdownFile(filePath) {
        // Obtiene la extensión del archivo
    const fileExtension = path.extname(filePath);
        // Comprueba si la extensión está en la lista de extensiones Markdown válidas
    return mdExtensions.includes(fileExtension);
};


// funcion para verificar si lee el archivo md
/**
 * Lee el contenido de un archivo Markdown.
 *
 * @param {string} filePath - La ruta del archivo Markdown a leer.
 * @returns {Promise<string>} - Una promesa que se resolverá con el contenido del archivo.
 */
function readMarkdownFile(filePath) {
    return new Promise((resolve, reject) => {
        // Utiliza fs.readFile para leer el contenido del archivo de manera asíncrona
        fs.readFile(filePath, "utf-8", (error, content) => {
            if (error) {
                //console.error("Error al leer el archivo:", error);
                reject(error); // Rechazamos la promesa en caso de error al leer el archivo.
            } else {
                //console.log("Content al leer el archivo:", content);
                resolve(content); // Resolvemos la promesa con el contenido del archivo si la lectura es exitosa.
            }
        });
    });
}

// funcion para extraer los md links
/**
 * Extrae los enlaces de un contenido en formato Markdown.
 *
 * @param {string} markdownContent - El contenido Markdown del cual extraer los enlaces.
 * @returns {Array} - Un array de objetos que contienen el texto, la URL y el archivo asociado de los enlaces encontrados.
 */
function extractMarkdownLinks(markdownContent) {
    //console.log("markdownContent ===>", markdownContent); // Imprime el contenido Markdown para depuración.
        // Expresión regular para encontrar enlaces Markdown
    const markdownLinkRegex  =  /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    const links = []; // Array donde se almacenarán los enlaces encontrados.
    let match;

    // Usar un bucle while y la función exec para encontrar todos los enlaces en el contenido.
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
/**
 * Verifica si una cadena es una URL válida.
 *
 * @param {string} str - La cadena que se va a verificar.
 * @returns {boolean} - true si la cadena es una URL válida, false si no.
 */
function isUrlValid(str) {
        // Expresión regular para validar una URL
    //console.log(str)
    const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocolo
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // nombre del dominio
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // 0 direccion IP (v4)
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // úerto y ruta
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // cadena de consulta
        "(\\#[-a-z\\d_]*)?$", // localizador de fragmentos
        "i"
    );
    return urlPattern.test(str);
}

// funcion para traer el status code
/**
 * Obtiene el estado de una URL haciendo una solicitud GET.
 *
 * @param {string} url - La URL a la que se hará la solicitud.
 * @returns {Promise<Object>} - Una promesa que se resolverá con un objeto que contiene la información del estado de la URL.
 Se utiliza axios.get para hacer la peticion o la solicitud http
*/
const getURLStatus = (url) => { //pasar urls y revisar promesa
    // return new Promise((resolve, reject) => {
        return axios.get(url)
            .then((response) => {
             // Si la solicitud es exitosa, devuelve un objeto con la URL, el estado y "ok".
                return ({
                    url,
                    status: response.status,
                    ok: "ok",
                });
            })
            .catch((error) => {
            // Si hay un error en la solicitud, maneja el error y devuelve un objeto con la URL, el estado y "fail".
                // console.log("getURLStatus error :", error)
                // console.log("AQUI ", error)
                //TRUTHY 
                if (!error?.response) {
            // Si no hay una propiedad 'response' en el error (puede ocurrir en errores de red), establece el estado en 400.
                    return ({
                        url,
                        status: 400,
                        ok: "fail",
                    });
                } else {
            // Si hay una propiedad 'response' en el error, utiliza el estado de la respuesta.
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