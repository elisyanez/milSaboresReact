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
