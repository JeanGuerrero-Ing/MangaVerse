import { registrarPedido } from '../data/checkout';
import { leerDatos, guardarDatos } from '../data/almacenamiento';
import { mangas } from '../data/mangas';

describe('registrarPedido', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('registra la compra, descuenta stock y limpia los datos temporales', () => {
        localStorage.setItem('usuarioMangaVerse', 'ana');
        guardarDatos('productosMangaVerse', mangas.map((manga) => ({ ...manga, stock: 3 })));
        guardarDatos('pedidosMangaVerse', [{ id: '#0' }]);
        const carrito = [{ nombre: mangas[0].titulo, precio: 12990, cantidad: 2 }];
        guardarDatos('carritoMangaVerse', carrito);
        guardarDatos('cuponActivoMangaVerse', { codigo: 'MANGA' });

        const pedido = registrarPedido({
            carrito,
            subtotal: 25980,
            envio: 3000,
            descuento: 1000,
            region: 'metropolitana',
        });

        expect(pedido).toMatchObject({
            id: '#1',
            usuario: 'ana',
            productos: carrito,
            subtotal: 25980,
            envio: 3000,
            descuento: 1000,
            total: 27980,
            region: 'metropolitana',
            estado: 'Completado',
        });
        expect(leerDatos('productosMangaVerse', []).find((producto) => producto.titulo === mangas[0].titulo).stock).toBe(1);
        expect(leerDatos('ultimoPedidoMangaVerse', null)).toEqual(pedido);
        expect(leerDatos('pedidosMangaVerse', [])).toHaveLength(2);
        expect(leerDatos('carritoMangaVerse', null)).toEqual([]);
        expect(localStorage.getItem('cuponActivoMangaVerse')).toBeNull();
    });

    it('usa invitado por defecto y no permite que el total ni el stock queden bajo cero', () => {
        guardarDatos('productosMangaVerse', [{ ...mangas[0], stock: 1 }]);
        const pedido = registrarPedido({
            carrito: [{ nombre: mangas[0].titulo, cantidad: 4, precio: 500 }],
            subtotal: 100,
            envio: 0,
            descuento: 200,
            region: 'valparaiso',
        });

        expect(pedido.usuario).toBe('Invitado');
        expect(pedido.total).toBe(0);
        expect(leerDatos('productosMangaVerse', [])[0].stock).toBe(0);
    });
});
