/*const mdLinks = require("../");


describe("mdLinks", () => {

    it("should...", () => {
        console.log("FIX ME!");
    });

});*/
const { transformRoute, routeExists, isMarkdownFile, readMarkdownFile, isUrlValid, extractMarkdownLinks, getURLStatus } = require("../lib/app.js"); // ruta de módulo
const path = require('path');
const axios = require('axios');

//test 1 transforma la ruta

describe('transformRoute', () => {
    it('Debería retornar la ruta absoluta si ya es una ruta absoluta', () => {
        const absolutePath = '/ruta/absoluta/a/un/archivo';
        const result = transformRoute(absolutePath);
        expect(result).toBe(absolutePath);
    });

    it('Debería resolver la ruta si es una ruta relativa', () => {
        const relativePath = 'ruta/relativa/a/un/archivo';
        const result = transformRoute(relativePath);
        const resolvedPath = path.resolve(relativePath);
        expect(result).toBe(resolvedPath);
    });
});

//test 2 existe la ruta

describe('routeExists', () => {
    it('Debería retornar true si la ruta existe', () => {
        const existingRoute = __dirname; // Usar la carpeta actual como ejemplo
        const result = routeExists(existingRoute);
        expect(result).toBe(true);
    });

    it('Debería retornar false si la ruta no existe', () => {
        const nonExistingRoute = 'ruta/que/no/existe';
        const result = routeExists(nonExistingRoute);
        expect(result).toBe(false);
    });
});

//test 3 si es un archivo md

describe('isMarkdownFile', () => {
    it('Debería retornar true para una ruta de archivo de Markdown (.md)', () => {
        const filePath = 'archivo.md';
        const result = isMarkdownFile(filePath);
        expect(result).toBe(true);
    });

    /*it('Debería retornar true para una ruta de archivo de Markdown (.markdown)', () => {
        const filePath = 'archivo.markdown';
        const result = isMarkdownFile(filePath);
        expect(result).toBe(true);
    });*/

    it('Debería retornar false para una ruta de archivo que no es de Markdown', () => {
        const filePath = 'archivo.txt';
        const result = isMarkdownFile(filePath);
        expect(result).toBe(false);
    });
});

//test 4 leer el archivo md
describe('readMarkdownFile', () => {
    it('debe leer el contenido de un archivo Markdown', () => {
        const filePath = "./examples/README.md";
        readMarkdownFile(filePath, (error, content) => {
            if (error) {
                done(error); // Pasar el error a done para indicar un fallo en la prueba
            } else {
                expect(content).to.be.a('string'); // Comprueba que el contenido es una cadena
                expect(content).to.include('contenido esperado'); // Comprueba que el contenido contiene lo que esperas
                done(); // Llama a done() para indicar que la prueba ha finalizado con éxito
            }
        });
    });

    it('debe manejar errores al leer un archivo inexistente', () => {
        const filePath ='/Users/lapto/Documents/DEV010-md-links/examples/README.md';
        readMarkdownFile(filePath, (error, content) => {
            expect(error).to.be.an.instanceOf(Error); // Comprueba que se arroje un error
            done(); // Llama a done() para indicar que la prueba ha finalizado con éxito
        });
    });
});

// test 5 encontraste urls validos

describe('isUrlValid', () => {
    it('Debería retornar true para una URL válida', () => {
        const validUrls = [
            "https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4",
            "https://nodejs.org/es/",
        ];

        validUrls.forEach((url) => {
            expect(isUrlValid(url)).toBe(true);
        });
    });

    it('Debería retornar false para una URL inválida', () => {
        const invalidUrls = [
            'http:/example.com',        // URL con un solo slash después del protocolo
            'https://example.com/lorem ipsum', // URL con espacio en la ruta
            'https://example.com?query=test?', // URL con dos signos de interrogación en la query
            'https://example.com#fragment#',   // URL con dos signos de numeral en el fragmento
        ];

        invalidUrls.forEach((url) => {
            expect(isUrlValid(url)).toBe(false);
        });
    });
});

// test 6 extraer links

describe('extractMarkdownLinks', () => {
  it('Debería extraer los enlaces de contenido Markdown', () => {
    const markdownContent = `
      [Node.js](https://nodejs.org/es/)
      [md-links](https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4)
    `;

    const links = extractMarkdownLinks(markdownContent);

    expect(links).toEqual([
      { text: 'Node.js', href: 'https://nodejs.org/es/' },
      { text: 'md-links', href: 'https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4' },
    ]);
  });

  it('Debería manejar contenido Markdown sin enlaces', () => {
    const markdownContent = 'Este es un texto sin enlaces en Markdown.';

    const links = extractMarkdownLinks(markdownContent);

    expect(links).toEqual([]);
  });
});

// test 7 get url status

jest.mock('axios');

describe('getURLStatus', () => {
    it('debe devolver el estado de una URL válida', (done) => {
        axios.get.mockResolvedValue({ status: 200 });

        getURLStatus('https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4').then((result) => {
            expect(result).toEqual({ url: 'https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4', status: 200 });
            done();
        });
    });

    it('debe manejar un error al obtener el estado de una URL inválida', (done) => {
        axios.get.mockRejectedValue({ message: 'Request failed with status code 404' }); // Simulamos un error de URL no encontrada
    
        getURLStatus('https://example.com/lorem ipsum').then((result) => {
            expect(result).toEqual({
                url: 'https://example.com/lorem ipsum',
                status: 'Error: Request failed with status code 404',
            });
            done();
        });
    });
});

/*describe('getURLStatus', () => {
    it('debería retornar el estado 200 para una URL válida', (done) => {
      const url = 'https://www.google.com'; // Una URL válida que debería devolver 200
      getURLStatus(url)
        .then((result) => {
          expect(result.status).toBe(200);
          expect(result.ok).toBe('ok');
          done();
        });
    });
  
    it('debería manejar errores 404 para una URL no encontrada', (done) => {
      const url = 'https://www.ejemplo.com/url-no-existente'; // Una URL que debería devolver un error 404
      getURLStatus(url)
        .then((result) => {
          expect(result.status).toBe(404);
          expect(result.ok).toBe('fail');
          done();
        });
    });
  
    it('debería manejar errores de red o tiempo de espera', (done) => {
      const url = 'https://www.ejemplo.com/url-inexistente'; // Una URL que no existe
      getURLStatus(url)
        .then((result) => {
          expect(result.status).toBe('Error: Network Error');
          expect(result.ok).toBe('fail');
          done();
        });
    });
});*/