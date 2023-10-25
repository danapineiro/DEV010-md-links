// Importa el módulo 'path' si no se ha importado previamente
const path = require("path"); // Trabaja con las rutas de archivos y directorios
const fs = require("fs");
let colors = require("colors");

// No olvidar cambiar los errores a ingles :)
// Aquí empiezan mis funciones

// Definición de una función llamada isAbsoluteRoute que verifica si una ruta es absoluta
const isAbsoluteRoute = (route) => { 
    return path.isAbsolute(route); // Utiliza la función path.isAbsolute para realizar la verificación
};

// Prueba de que la ruta es absoluta
const absolute ="/Users/Usuario/documentos/archivo.txt";
console.log(isAbsoluteRoute(absolute));

// Prueba con una ruta absoluta
const routeAbsolute = "/Users/Usuario/documentos/archivo.txt";
const isAbsolute = isAbsoluteRoute(routeAbsolute);
console.log(`¿Es la ruta absoluta? ${isAbsolute}`.green); // Debería imprimir "¿Es la ruta absoluta? true"

// Prueba con una ruta relativa
const routeRelative = "./examples/README.MD";
const isAbsoluteTwo = isAbsoluteRoute(routeRelative);
console.log(`¿Es la ruta absoluta? ${isAbsoluteTwo}`.red); // Debería imprimir "¿Es la ruta absoluta? false"

// Definición de una función llamada transformRoute que resuelve una ruta relativa en una ruta absoluta
const transformRoute = (route) => {
    return path.resolve(route); // Utiliza la función path.resolve para resolver la ruta
};

// Prueba de que transforma la ruta
const relativeRoute = "./examples/README.MD";
const absoluteRoute = transformRoute(relativeRoute);
console.log(`Ruta absoluta: ${absoluteRoute}`.rainbow); // Imprime en consola

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
const route = "./examples/README.noes";

if (routeExists(route)) {
    console.log(`La ruta ${route} existe en el computador.`.green);
} else {
    console.log(`La ruta ${route} no existe en el computador.`.red);
}

// funcion para verificar si es archivo es markdown
const mdExtensions = [".md", ".mkd", ".mdwn", ".mdown", ".mdtxt", ".mdtext", ".markdown", ".text"];

const isMarkdownFile =(filePath) => {
    const fileExtension = path.extname(filePath);
    return mdExtensions.includes(fileExtension);
};
// comprobamos si es un archivo markdown y podemos cambiar la extension
// para comprobar que si manda el error cuando no es markdown
const file = "archivo.md";

if(isMarkdownFile(file)){
    console.log(`${file} es un archivo Markdown.`.green);
} else {
    console.log(`${file} no es un archivo Markdown.`.red);
}

// Exporta las funciones para que estén disponibles en otros módulos
module.exports ={
    isAbsoluteRoute,
    transformRoute,
    routeExists,
    isMarkdownFile,
    colors
};