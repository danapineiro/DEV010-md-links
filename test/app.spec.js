const { transformRoute, routeExists, isMarkdownFile, readMarkdownFile, isUrlValid, extractMarkdownLinks, getURLStatus } = require("../lib/app.js"); // ruta de módulo
const path = require('path');
const axios = require('axios');

//test 1 transforma la ruta

describe('transformRoute', () => {

    // Prueba 1: Debería retornar la ruta absoluta si ya es una ruta absoluta
    it('Debería retornar la ruta absoluta si ya es una ruta absoluta', () => {
        const absolutePath = '/ruta/absoluta/a/un/archivo';
        // Llama a la función transformRoute con una ruta absoluta
        const result = transformRoute(absolutePath);
        // Compara el resultado con la ruta absoluta original
        expect(result).toBe(absolutePath);
    });

    // Prueba 2: Debería resolver la ruta si es una ruta relativa
    it('Debería resolver la ruta si es una ruta relativa', () => {
        const relativePath = 'ruta/relativa/a/un/archivo';
        // Llama a la función transformRoute con una ruta relativa
        const result = transformRoute(relativePath);
        // Resuelve manualmente la ruta relativa para obtener la ruta absoluta esperada
        const resolvedPath = path.resolve(relativePath);
        // Compara el resultado de transformRoute con la ruta absoluta resuelta
        expect(result).toBe(resolvedPath);
    });
});

//test 2 existe la ruta

describe('routeExists', () => {

    // Prueba 1: Debería retornar true si la ruta existe
    it('Debería retornar true si la ruta existe', () => {
        const existingRoute = "./examples/README.md";
        // Llama a la función routeExists con una ruta existente
        const result = routeExists(existingRoute);
        // Compara el resultado con true, ya que la ruta debería existir
        expect(result).toBe(true);
    });

    // Prueba 2: Debería retornar false si la ruta no existe
    it('Debería retornar false si la ruta no existe', () => {
        const nonExistingRoute = 'ruta/que/no/existe';
        // Llama a la función routeExists con una ruta que no existe
        const result = routeExists(nonExistingRoute);
        // Compara el resultado con false, ya que la ruta no debería existir
        expect(result).toBe(false);
    });
});

//test 3 si es un archivo md

describe('isMarkdownFile', () => {
    // Prueba 1: Debería retornar true para una ruta de archivo de Markdown (.md)
    it('Debería retornar true para una ruta de archivo de Markdown (.md)', () => {
        const filePath = 'archivo.md';
        // Llama a la función isMarkdownFile con una ruta de archivo de Markdown
        const result = isMarkdownFile(filePath);
        // Compara el resultado con true, ya que debería ser un archivo Markdown
        expect(result).toBe(true);
    });

    // Prueba 2: Debería retornar false para una ruta de archivo que no es de Markdown
    it('Debería retornar false para una ruta de archivo que no es de Markdown', () => {
        const filePath = 'archivo.txt';
        // Llama a la función isMarkdownFile con una ruta de archivo que no es de Markdown
        const result = isMarkdownFile(filePath);
        // Compara el resultado con false, ya que no debería ser un archivo Markdown
        expect(result).toBe(false);
    });
});

//test 4 leer el archivo md
describe('readMarkdownFile', () => {
    // Prueba 1: Debe leer el contenido de un archivo Markdown
    it('debe leer el contenido de un archivo Markdown', () => {
        const filePath = "./examples/README.md";
        
        // Llama a la función readMarkdownFile
        readMarkdownFile(filePath, (error, content) => {
            if (error) {
                done(error); // Pasar el error a done para indicar un fallo en la prueba
            } else {
                // Comprueba que el contenido es una cadena
                expect(content).to.be.a('string');
                // Comprueba que el contenido contiene lo que esperas
                expect(content).to.include('contenido esperado'); 
                done(); // Llama a done() para indicar que la prueba ha finalizado con éxito
            }
        });
    });

    // Prueba 2: Debe manejar errores al leer un archivo inexistente
    it('debe manejar errores al leer un archivo inexistente', () => {
        
        // Llama a la función readMarkdownFile con una ruta inexistente
        const filePath ='/Users/lapto/Documents/DEV010-md-links/examples/README.md';
        readMarkdownFile(filePath, (error, content) => {
             // Comprueba que se arroje un error
            expect(error).to.be.an.instanceOf(Error);
            done(); // Llama a done() para indicar que la prueba ha finalizado con éxito
        });
    });
});

// test 5 encontraste urls validos

describe('isUrlValid', () => {
    
    // Prueba 1: Debería retornar true para una URL válida
    it('Debería retornar true para una URL válida', () => {
        const validUrls = [
            "https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4",
            "https://nodejs.org/es/",
        ];

        // Utiliza forEach para iterar sobre las URLs válidas
        validUrls.forEach((url) => {
            // Compara el resultado de isUrlValid con true para cada URL válida
            expect(isUrlValid(url)).toBe(true);
        });
    });

    // Prueba 2: Debería retornar false para una URL inválida
    it('Debería retornar false para una URL inválida', () => {
        const invalidUrls = [
            'http:/example.com',        // URL con un solo slash después del protocolo
            'https://example.com/lorem ipsum', // URL con espacio en la ruta
            'https://example.com?query=test?', // URL con dos signos de interrogación en la query
            'https://example.com#fragment#',   // URL con dos signos de numeral en el fragmento
        ];

        // Utiliza forEach para iterar sobre las URLs inválidas
        invalidUrls.forEach((url) => {
            // Compara el resultado de isUrlValid con false para cada URL inválida
            expect(isUrlValid(url)).toBe(false);
        });
    });
});

// test 6 extraer links

describe('extractMarkdownLinks', () => {
  // Prueba 1: Debería extraer los enlaces de contenido Markdown
  it('Debería extraer los enlaces de contenido Markdown', () => {
    const markdownContent = `
      [Node.js](https://nodejs.org/es/)
      [md-links](https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4)
    `;

    // Llama a la función extractMarkdownLinks con el contenido Markdown que contiene enlaces
    const links = extractMarkdownLinks(markdownContent);

    
    // Compara el resultado con un array de objetos esperado
    expect(links).toEqual([
      { text: 'Node.js', href: 'https://nodejs.org/es/' },
      { text: 'md-links', href: 'https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4' },
    ]);
  });

  // Prueba 2: Debería manejar contenido Markdown sin enlaces
  it('Debería manejar contenido Markdown sin enlaces', () => {
    const markdownContent = 'Este es un texto sin enlaces en Markdown.';

    // Llama a la función extractMarkdownLinks con contenido Markdown que no contiene enlaces
    const links = extractMarkdownLinks(markdownContent);

    // Compara el resultado con un array vacío, ya que no hay enlaces en el contenido
    expect(links).toEqual([]);
  });
});

// test 7 get url status

jest.mock('axios');  // Mockea el módulo 'axios' para controlar su comportamiento en las pruebas.

describe('getURLStatus', () => {
    
    // Prueba 1: Debe devolver el estado de una URL válida
    it('debe devolver el estado de una URL válida', (done) => {
        axios.get.mockResolvedValue({ status: 200 });

        // Llama a getURLStatus con una URL válida y verifica el resultado
        getURLStatus('https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4').then((result) => {
        // Compara el resultado con el objeto esperado    
        expect(result).toEqual({ url: 'https://github.com/Laboratoria/bootcamp/assets/12631491/fc6bc380-7824-4fab-ab8f-7ab53cd9d0e4', 
            status: 200,
             ok: "ok", 
            });
            done(); // Llama a done() para indicar que la prueba ha finalizado
        });
    });

    // Prueba 2: Debe manejar un error al obtener el estado de una URL inválida
    it('debe manejar un error al obtener el estado de una URL inválida', (done) => {
        axios.get.mockRejectedValueOnce({ response: { status: 400 } });
    
        // Llama a getURLStatus con una URL inválida y verifica el manejo del error
        getURLStatus('http:/example.com').catch((result) => {
            // Compara el resultado con el objeto esperado
            expect(result).toEqual({
                url: 'http:/example.com',
                status: 'Error: 400',
                ok: 'fail',
            });
        });
        done(); // Llama a done() para indicar que la prueba ha finalizado
    });
    
    // Prueba 3: Debe manejar un error al obtener el estado de una URL inválida
    it('debe manejar un error al obtener el estado de una URL inválida', (done) => {
        axios.get.mockRejectedValue({ message: 'Request failed with status code 400' }); // Simulamos un error de URL no encontrada

        // Llama a getURLStatus con una URL inválida y verifica el manejo del error
        getURLStatus('https://example.com/lorem ipsum').then((result) => {
             // Compara el resultado con el objeto esperado    
             expect(result).toEqual({
                url: 'https://example.com/lorem ipsum',
                status: 400,
                ok: "fail",
            });
            
        });
        done(); // Llama a done() para indicar que la prueba ha finalizado
    });
});
