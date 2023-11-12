# Proyecto MDLinks en Node.js

Este proyecto tiene como objetivo crear una librería en Node.js que sirva como herramienta para analizar enlaces dentro de archivos Markdown. Es importante destacar que Node.js es un entorno de ejecución para JavaScript.

## Desarrollo por Hitos

### **Hito 1**

-   Creación de la promesa `mdLinks`.
-   Transformación de la ruta ingresada a absoluta.
-   Verificación de que la ruta existe en el sistema.
-   Comprobación de que el archivo es de tipo Markdown.
-   Lectura del contenido del archivo.
-   Identificación de los enlaces dentro del documento.
-   Creación de tests para cada función de este hito.

### **Hito 2**

-   Validación de los enlaces.
-   Desarrollo de una función para obtener el código de estado HTTP de respuesta.
-   Implementación de tests para la función `getUrlStatus`, con el uso de mocks para axios.

# Contenido
 1. Diagrama de flujo.
 2. Creación de issues y milestones en Github projects.
 3. Características generales
 4. Características de cada función.
 5. Tecnologías utilizadas.
 6. Testing.

## 1. Diagrama de flujo.

<a href="https://ibb.co/Q6gYcY1"><img src="https://i.ibb.co/P5L1Y1f/Diagrama-de-Flujo-Dariana-Pi-eiro.jpg" alt="Diagrama-de-Flujo-Dariana-Pi-eiro" border="0"></a>

## 2.**Creación de Issues y Milestones en GitHub Projects**

En este proyecto, se implementó un sistema efectivo de organización y seguimiento utilizando las funcionalidades de GitHub Projects, milestones e issues. Esta práctica me permitió mantener un control claro sobre las tareas y avanzar de manera estructurada al cerrar cada tarea completada.

La utilización de milestones me brindó la capacidad de agrupar y asignar tareas específicas a hitos particulares, proporcionando una visión general del progreso del proyecto. Por otro lado, las issues se convirtieron en unidades manejables que desglosaron el trabajo en elementos más pequeños y manejables. El cierre de cada issue marcó un logro claro y tangible en mi avance.

Esta metodología se reveló como un enfoque eficiente y organizado, especialmente beneficioso en entornos colaborativos o proyectos con varios desarrolladores. Proporcionó una estructura organizativa clara y resolviendo problemas de manera sistemática.

<a href="https://ibb.co/94yrcgv"><img src="https://i.ibb.co/s1sVbRP/Captura-de-pantalla-2023-11-10-214051.png" alt="Captura-de-pantalla-2023-11-10-214051" border="0"></a>
<a href="https://ibb.co/1GKSJ9m"><img src="https://i.ibb.co/fdtcGCx/Captura-de-pantalla-2023-11-10-213950.png" alt="Captura-de-pantalla-2023-11-10-213950" border="0"></a>


## 3. Características generales.
Este proyecto consta de 3 documentos principales.
- **index.js:** Contiene la promesa `mdLinks`.
- **app.js:** Contiene funciones útiles para trabajar con archivos Markdown y validar enlaces.
-   **app.spec.js:** Contiene los tests para las funciones.

## 4. Características de cada función.
 ***index.js***

La promesa `mdLinks`, sirve para realizar operaciones asíncronas de manera controlada y gestionar el flujo de ejecución del programa.
Básicamente lo que hace adicional a lo antes mencionado es el manejo de errores con **reject** cuando esta promesa se rechaza y se pueden capturar mejor los errores de manera centralizado con el bloque **.catch()**, resolución con resultados para cuando esta promesa se resuelva usando **resolve** y por ultimo con **.then()** y **.catch()** manejan resultados o errores en los estos bloques respectivamente.

Dentro de la promesa también se utiliza el process.argv que es una propiedad en Node.js que devuelve una matriz con los argumentos de la línea de comandos utilizados para ejecutar un script. La primera posición (`process.argv[0]`) generalmente contiene la ruta del ejecutable de Node.js, y la segunda posición (`process.argv[1]`) contiene la ruta del script que se está ejecutando. Los argumentos pasados al script comienzan a partir de la tercera posición en adelante. específicamente usado para hacer el validate de los links.

La mdLinks facilita la escritura de código asíncrono más legible y mantenible, permitiendo el manejo más estructurado de operaciones asíncronas y errores en el programa.

***app.js***

En este documento viven las funciones útiles para trabajar con archivos Markdown y validar enlaces.

- **transformRoute(route)**
 Convierte una ruta relativa a una ruta absoluta.

- **routeExists(route)**
Comprueba si una ruta de archivo o directorio existe.
si la ruta existe devuelve **true** y si la ruta no existe devuelve **false**.

- **isMarkdownFile(filePath)**
Verifica si un archivo tiene una extensión Markdown. Del mismo modo devuelve **true** si es un archivo md y si no devuelve **false**.

- **readMarkdownFile(filePath)**
Lee el contenido de un archivo Markdown de forma asíncrona.

- **extractmarkdownLinks(markdownContent)**
Extrae los enlaces Markdown (text, URL y file) de un contenido md.

- **isUrlValid(str)**
Verifica si una cadena dada es una URL válida. Devuelve **true or false** según sea el caso.

- **getUrlStatus(url)**
Obtiene el estado **(status code)** de una URL haciendo la petición HTTP con axios.
Esta función retorna una promesa que devuelve un objeto con URL, status: ok o fail, status code, file y text.

En general estas funciones proporcionan utilidades para trabajar con archivos, validar enlaces y obtener el estado de las URL.


## 5. Tecnologías utilizadas.

-   **JavaScript:** Lenguaje de programación de alto nivel y orientado a objetos.
-   **Módulo fs:** Para interactuar con el sistema de archivos.
-   **Módulo path:** Para trabajar con rutas de archivos y directorios.
-   **Axios:** Biblioteca para realizar solicitudes HTTP.
-   **EsLint:** Herramienta de linting para JavaScript.
-   **Jest:** Marco de prueba para JavaScript.

## 6. Testing.

***npm run test***

<a href="https://ibb.co/xs065Yk"><img src="https://i.ibb.co/wLX467k/test.png" alt="test" border="0"></a>