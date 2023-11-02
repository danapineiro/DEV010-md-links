/*const mdLinks = require("../");


describe("mdLinks", () => {

    it("should...", () => {
        console.log("FIX ME!");
    });

});*/

/*describe("exist",()=>{
    const route = "C:/Laboratoria/Proyectos/DEV010-md-links/README.md";
    const routeFalse= "C:/Laboratoria/Proyectos/README.md";
    it("is a function",()=>{
        expect(typeof exist).toBe("function");
    });
    it("deberia mostrar false porque no existe ruta", ()=>{
        expect(exist(routeFalse)).toEqual(false);
    });
    it("deberia retornar true ",() => {
        expect(exist(route)).toEqual(true);
    });
});*/

const transformRoute = require("../index.js"); // ruta de módulo

describe("transformRoute", () => {
    const absRoute = "C:/Laboratoria/Proyectos/DEV010-md-links/README.md";
    const relativeRoute = "README.md";
    
    it("Retorna la ruta absoluta", () => {
        expect(transformRoute(absRoute)).toBe(absRoute);
    });
    
    it("Retorna la false en ruta relativa", () => {
        expect(transformRoute(relativeRoute)).not.toBe(relativeRoute);
    });
});
