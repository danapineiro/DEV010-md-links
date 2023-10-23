// Se obtiene la ruta del archivo
// import
const path = require("./lib/app.js");

// Aqui la funcion mdLinks
const mdLinks = (route) => new Promise((resolve, reject) => {
    if (path.isAbsolute(route)) {
        resolve(route);
    } else {
        const adsolutePath = path.resolve(route);
        if(!adsolutePath){
            resolve(adsolutePath);
        } else {
            reject("La ruta no es valida.");
        }
    }
});
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