const path = require("path"); // Trabaja con las rutas de archivos y directorios
// Aquí empiezan mis funciones

const isAbsoluteRoute = (route) => {
    return path.isAbsolute(route);
};
console.log(isAbsoluteRoute);

const transformRoute = (route) => {
    return path.resolve(route);
};
console.log(transformRoute);

module.exports ={
    isAbsoluteRoute,
};