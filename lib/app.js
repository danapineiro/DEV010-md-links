// Importa el módulo 'path' si no se ha importado previamente
const path = require("path"); // Trabaja con las rutas de archivos y directorios
const readline = require("readline");
const fs = require("fs");
const axios = require("axios"); //axios es una libreria para poder hacer llamadas HTTP

let colors = require("colors");

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

// Definición de una función llamada transformRoute que resuelve una ruta relativa en una ruta absoluta
const transformRoute = (route) => {
    if (path.isAbsolute(route)) {
        return route;
    }else{
        return path.resolve(route); // Utiliza la función path.resolve para resolver la ruta
    }
};

// Prueba de que transforma la ruta
// const relativeRoute = "./examples/README.MD";
// const absoluteRoute = transformRoute(relativeRoute);
// console.log(`Ruta absoluta: ${absoluteRoute}`.rainbow); // Imprime en consola

// Funcion para comprobar que la ruta existe
const routeExists = (route) =>{
    try {
        fs.accessSync(route);
        return true; // La ruta existe
    } catch (error) {
        return false; // La ruta no existe
    }
};

// Prueba si existe la ruta, podemos cambiar una letra para que diga que la ruta no existe
// const route = "./examples/README.md";

// if (routeExists(route)) {
//     console.log(`La ruta ${route} existe en el computador.`.green);
// } else {
//     console.log(`La ruta ${route} no existe en el computador.`.red);
// }

// funcion para verificar si es archivo es markdown
const mdExtensions = [".md", ".mkd", ".mdwn", ".mdown", ".mdtxt", ".mdtext", ".markdown", ".text"];

const isMarkdownFile =(filePath) => {
    const fileExtension = path.extname(filePath);
    return mdExtensions.includes(fileExtension);
};
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

function readMarkdownFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf-8", (error, content) => {
            if (error) {
                //console.error("Error al leer el archivo:", error);
                reject(error);
            } else {
                resolve(content);
            }
        });
    });
}

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
// }

const fileReader = readline.createInterface({ //mi variable reader va a leer el archivo que quiero que lea. 
    input: fs.createReadStream("./examples/README.md")
});
//C:\Users\lapto\Documents\DEV010-md-links\examples\README.md

fileReader.on("line", function (line) {  // Este controlador de eventos lee el archivo línea por línea.
    const isUrl = isUrlValid(line); // Aquí comprobamos si la línea es una URL válida.
    let validUrls = [];  // Inicializamos un array para almacenar las URL válidas encontradas en el archivo.

    if (isUrl) {
        validUrls.push(line); // Si la línea es una URL válida, la agregamos al array.
    }
    if (validUrls.length) {  // Si el array no está vacío, lo enviamos a la función que realizará la solicitud GET (validateLinks).
        getURLStatus(validUrls).then((res) => console.log(res));
    }
});

/*function extractMarkdownLinks(markdownContent) {
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links = ["./examples/README.md"];
    
    let match;
    while ((match = linkPattern.exec(markdownContent)) !== null) {
        const text = match[1];
        const url = match[2];
        links.push({ text, url });
    }
    
    return links;
}*/

function isUrlValid(str) { //este es mi funcion de regex de validacion de URL que me retorna true or false segun sea el caso. 
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

const getURLStatus = (url) => new Promise((resolve, reject) => { //a la funcion is localfile le paso un array de URLS
    axios.get(url) //con anxios.get hago la llamada GET a la URL . Esto guarda un array de promesas
        .then((response) => { //Si la respuesta es exitosa, construyo un object que contiene mi url y su estatus.code. ESTE 
            //OBJETO ES EL QUE RETORNO EN LA LINEA 16 pero hasta que la funcion promise.all termine. 
            resolve({
                url,
                status: response.status,
            });
        })
        .catch((error) => { // si ese error regresa un objeto pero con status error
            let statusCode = 500;
            if (error.response) {
                statusCode = error.response.status;
            }
            reject({
                url,
                status: statusCode,
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
});


// Exporta las funciones para que estén disponibles en otros módulos
module.exports ={
    //isAbsoluteRoute,
    transformRoute,
    routeExists,
    isMarkdownFile,
    readMarkdownFile,
    //extractMarkdownLinks,
    isUrlValid,
    getURLStatus,
    colors
};