import {
    agregarAlCarrito,
    calcularPrecioOferta,
    formatearPrecio,
    guardarDatos,
    inicializarAdministrador,
    leerDatos,
    obtenerCuentaActiva,
    obtenerGeneros,
    obtenerProductos,
} from '../data/almacenamiento';
import { mangas } from '../data/mangas';

describe('almacenamiento', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('lee valores guardados o devuelve el valor inicial', () => {
        expect(leerDatos('ausente', [])).toEqual([]);
        guardarDatos('preferencias', { tema: 'claro' });
        expect(leerDatos('preferencias', null)).toEqual({ tema: 'claro' });
    });

    it('combina géneros iniciales con los guardados sin duplicados ni entradas inválidas', () => {
        guardarDatos('generosMangaVerse', [
            { valor: 'seinen', etiqueta: 'Seinen duplicado' },
            { valor: 'josei', etiqueta: 'Josei' },
            null,
            { valor: 'sin-etiqueta' },
        ]);

        const generos = obtenerGeneros();
        expect(generos.find((genero) => genero.valor === 'seinen').etiqueta).toBe('Seinen');
        expect(generos).toContainEqual({ valor: 'josei', etiqueta: 'Josei' });
        expect(generos).toHaveLength(6);

        guardarDatos('generosMangaVerse', { valor: 'shonen', etiqueta: 'Shonen' });
        expect(obtenerGeneros()).toHaveLength(5);
    });

    it('formatea precios y aplica solo descuentos válidos', () => {
        expect(formatearPrecio(12990)).toBe('$12.990');
        expect(calcularPrecioOferta({ precio: 10000, ofertaActiva: true, descuentoPorcentaje: 25 })).toBe(7500);
        expect(calcularPrecioOferta({ precio: 10000, ofertaActiva: false, descuentoPorcentaje: 25 })).toBe(10000);
        expect(calcularPrecioOferta({ precio: 10000, ofertaActiva: true, descuentoPorcentaje: 100 })).toBe(10000);
    });

    it('resuelve la cuenta activa desde cuentas registradas o desde el registro reciente', () => {
        expect(obtenerCuentaActiva()).toBeNull();
        localStorage.setItem('usuarioMangaVerse', 'ana');
        expect(obtenerCuentaActiva()).toBeNull();

        guardarDatos('cuentasMangaVerse', [{ usuario: 'ana', rol: 'cliente' }]);
        expect(obtenerCuentaActiva()).toEqual({ usuario: 'ana', rol: 'cliente' });

        localStorage.removeItem('cuentasMangaVerse');
        guardarDatos('cuentaRegistrada', { usuario: 'ana', rol: 'cliente' });
        expect(obtenerCuentaActiva()).toEqual({ usuario: 'ana', rol: 'cliente' });
        guardarDatos('cuentaRegistrada', { usuario: 'otra', rol: 'cliente' });
        expect(obtenerCuentaActiva()).toBeNull();
    });

    it('crea el catálogo inicial y normaliza productos almacenados', () => {
        const iniciales = obtenerProductos();
        expect(iniciales).toHaveLength(mangas.length);
        expect(iniciales[0]).toMatchObject({ stock: 10, imagen: mangas[0].img });

        guardarDatos('productosMangaVerse', [
            { titulo: 'Producto heredado', imagen: '/heredada.jpg', precio: '5000', stock: '3' },
            { titulo: 'Producto sin stock', img: '/actual.jpg', precio: 1000, stock: 'inválido' },
        ]);
        expect(obtenerProductos()).toEqual([
            {
                titulo: 'Producto heredado',
                imagen: '/heredada.jpg',
                precio: '5000',
                stock: 3,
                id: 1,
                img: '/heredada.jpg',
                ofertaActiva: false,
                descuentoPorcentaje: 0,
            },
            {
                titulo: 'Producto sin stock',
                img: '/actual.jpg',
                precio: 1000,
                stock: 0,
                id: 2,
                imagen: '/actual.jpg',
                ofertaActiva: false,
                descuentoPorcentaje: 0,
            },
        ]);
    });

    it('actualiza precios del catálogo antiguo una sola vez', () => {
        guardarDatos('productosMangaVerse', mangas.map((manga) => ({
            titulo: manga.titulo,
            precio: 10000,
        })));

        const productos = obtenerProductos();
        expect(productos.map((producto) => producto.precio)).toEqual(mangas.map((manga) => manga.precio));
        expect(localStorage.getItem('preciosCatalogoMangaVerseV2')).toBe('true');
        expect(obtenerProductos()[0].precio).toBe(mangas[0].precio);
    });

    it('inicializa la cuenta administradora solo si aún no existe', () => {
        inicializarAdministrador();
        expect(leerDatos('cuentasMangaVerse', [])).toEqual([
            expect.objectContaining({ usuario: 'admin', rol: 'admin' }),
        ]);
        guardarDatos('cuentasMangaVerse', [{ usuario: 'admin', rol: 'admin' }]);
        inicializarAdministrador();
        expect(leerDatos('cuentasMangaVerse', [])).toHaveLength(1);
    });

    it('agrega productos, actualiza cantidades y conserva el precio original cuando hay oferta', () => {
        const eventos = vi.fn();
        window.addEventListener('mangaverse:carrito-actualizado', eventos);
        const manga = { titulo: 'Berserk', precio: 10000, imagen: '/berserk.jpg', ofertaActiva: true, descuentoPorcentaje: 20 };

        agregarAlCarrito(manga);
        expect(leerDatos('carritoMangaVerse', [])[0]).toMatchObject({
            nombre: 'Berserk',
            precio: 8000,
            precioOriginal: 10000,
            cantidad: 1,
        });
        agregarAlCarrito({ ...manga, titulo: 'BERSERK', ofertaActiva: false });

        expect(leerDatos('carritoMangaVerse', [])[0]).toMatchObject({ cantidad: 2, precio: 10000 });
        expect(leerDatos('carritoMangaVerse', [])[0]).not.toHaveProperty('precioOriginal');
        expect(eventos).toHaveBeenLastCalledWith(expect.objectContaining({
            detail: { titulo: 'BERSERK', unidades: 2 },
        }));
        window.removeEventListener('mangaverse:carrito-actualizado', eventos);
    });
});
