# MangaVerse

Tienda de manga de demostración creada con React y Vite. El proyecto es una SPA: las vistas se muestran mediante React Router y los datos de prueba se guardan en el navegador con `localStorage`.

Para una explicación paso a paso de la estructura, rutas, Bootstrap, pruebas y acceso de demostración, consulta [GUIA-PARA-DESARROLLADORES.txt](./GUIA-PARA-DESARROLLADORES.txt).

## Requisitos

- Node.js y npm

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

## Ejecutar pruebas

```bash
npm run test
```

## Ejecutar prueba unitaria

```bash
npx vitest run "nombre.test.jsx"
```

## Ejecutar coverage

```bash
npm run coverage
```

Otros comandos disponibles:

```bash
npm test -- --run
npm run lint
npm run build
npm run preview
```

## Estructura principal

- `src/main.jsx`: inicia React, React Router, Bootstrap y los estilos globales.
- `src/App.jsx`: define las rutas, el encabezado, el banner y el pie de página.
- `src/pages/`: una página por vista (catálogo, carrito, cuenta, administración, entre otras).
- `src/componentes/`: piezas reutilizables de la interfaz.
- `src/data/`: catálogo inicial y funciones sencillas para guardar/leer datos del navegador.
- `src/css/`: estilos del sitio, organizados por sección.
- `src/test/`: pruebas de componentes y flujos básicos.
- `public/img/`: imágenes usadas por las páginas.

## Funcionalidades de demostración

- El catálogo permite buscar y filtrar manga.
- El carrito conserva productos, cantidades y cupones entre páginas; al finalizar registra una compra y actualiza el stock.
- El registro, inicio de sesión, edición de perfil e historial de pedidos usan los datos del navegador.
- El panel de administración permite gestionar productos, clientes y cupones, y consultar pedidos y métricas.
- La cuenta inicial de administración es `admin` / `admin123`.

Los datos están en `localStorage`; no existe servidor ni base de datos. Por eso las cuentas y contraseñas son solo para una demostración local y no se deben usar con información real. Para reiniciar los datos de prueba, limpia el almacenamiento del sitio desde las herramientas del navegador.
