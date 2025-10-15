# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size
# Mil Sabores (Aplicación React)

Proyecto creado con Create React App. Este README contiene instrucciones para que tus compañeros y colaboradores clonen el repositorio, instalen dependencias (sin incluir `node_modules`) y ejecuten la aplicación localmente.

## Importante sobre node_modules

La carpeta `node_modules/` no se incluye en el repositorio por diseño: las dependencias se definen en `package.json` y cada desarrollador debe instalar las dependencias en su máquina ejecutando `npm install` o `yarn install`. Esto evita subir miles de archivos al repositorio y mantiene el historial limpio.

Si quieres reproducir el proyecto en tu equipo, sigue los pasos en la sección "Instalación y ejecución".

## Requisitos previos

- Node.js (recomendado: 14.x, 16.x o superior). Comprueba tu versión con:

```powershell
node --version
npm --version
```

- Git instalado para clonar el repositorio.

## Instalación y ejecución (para colaboradores)

1. Clona el repositorio:

```powershell
git clone https://github.com/elisyanez/milSaboresReact.git
cd milSaboresReact
```

2. Instala las dependencias (esto crea `node_modules` localmente):

```powershell
npm install
# o, si prefieres yarn
# yarn install
```

3. Levanta la aplicación en modo desarrollo:

```powershell
npm start
# abre http://localhost:3000 en tu navegador
```

4. Para crear una versión lista para producción:

```powershell
npm run build
```

5. Ejecutar tests (si aplica):

```powershell
npm test
```

## Scripts disponibles

- `npm start` — inicia el servidor de desarrollo.
- `npm run build` — construye la app para producción.
- `npm test` — ejecuta los tests en modo watch.
- `npm run eject` — ejecta la configuración (operación irreversible).

## Variables de entorno

Si el proyecto requiere variables de entorno, añádelas en un archivo `.env` en la raíz del proyecto (no lo subas al repositorio). Por ejemplo:

```
REACT_APP_API_URL=https://api.example.com
```

## Contribuir

1. Crea una rama nueva para tu cambio:

```powershell
git checkout -b feat/nombre-de-la-feature
```

2. Haz commits claros y atómicos:

```powershell
git add .
git commit -m "feat: descripción corta del cambio"
```

3. Sube tu rama y crea un Pull Request desde GitHub:

```powershell
git push origin feat/nombre-de-la-feature
```

4. Pide revisión y cuando esté aprobada haz merge a `main` desde GitHub.

## Buenas prácticas y troubleshooting

- Si tienes problemas con dependencias rotas, borra `node_modules` y `package-lock.json` (o `yarn.lock`) y vuelve a instalar:

- Si `npm start` se queja del puerto, cambia el puerto o cierra la otra aplicación que lo esté usando.

## Contacto

Si algo no funciona o necesitas permisos para el repo, abre un issue en GitHub o contacta al mantenedor.

---

Gracias por colaborar — cualquier duda puedo ayudarte a configurar el entorno local.
