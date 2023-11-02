/*const mdLinks = require("../");


describe("mdLinks", () => {

    it("should...", () => {
        console.log("FIX ME!");
    });

});*/
const { transformRoute, routeExists, isMarkdownFile, readMarkdownFile, isUrlValid, extractMarkdownLinks } = require("../lib/app.js"); // ruta de módulo
const path = require('path');

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

it('Debería resolver la promesa con el contenido del archivo', (done) => {
    const filePath = './examples/README.md'; // Reemplaza con la ruta real del archivo
    const fileContent = `[md-links](https://github.com/Laboratoria/bootcamp/assets/1491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4)\n[Node.js](https://nodejs.org/es/)\n[Node.js](www.google.com)`;
    
    // Simula la función fileReader para devolver el contenido del archivo
    fileReader.mockImplementation((path, encoding, callback) => {
      callback(null, fileContent);
    });
  
    readMarkdownFile(filePath, fileReader)
      .then((result) => {
        expect(result).toBe(fileContent);
        expect(fileReader).toHaveBeenCalledWith(filePath, 'utf-8', expect.any(Function));
        done();
      });
  });
  
/*describe('readMarkdownFile', () => {
    it('Debería resolver la promesa con el contenido del archivo', (done) => {
        // Función simulada para la lectura de archivos
        const fileReader = jest.fn((filePath, encoding, callback) => {
            callback(null, '[md-links](https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4')
           
        });

        const filePath = "./examples/README.md";
        readMarkdownFile(filePath, fileReader)
            .then((result) => {
                expect(result).toBe('Contenido del archivo');
                expect(fileReader).toHaveBeenCalledWith(filePath, 'utf-8', expect.any(Function));
                done();
            });
    });*/

    it('Debería rechazar la promesa en caso de error al leer el archivo', (done) => {
        // Función simulada para la lectura de archivos
        const fileReader = jest.fn((filePath, encoding, callback) => {
            callback(new Error('Error de lectura de archivo'), null);
        });

        const filePath = "./examples/README.md";

        readMarkdownFile(filePath, fileReader)
            .catch((error) => {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe('Error de lectura de archivo');
                expect(fileReader).toHaveBeenCalledWith(filePath, 'utf-8', expect.any(Function));
                done();
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
            //'not_a_url',
            //'www.example.com',
            //'ftp://',
            //'file://path/to/file',
            //'http://example.com:8080:', // URL con dos puntos seguidos en el puerto
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



