import { guardarDatos, leerDatos, obtenerProductos } from './almacenamiento';

export function registrarPedido({ carrito, subtotal, envio, descuento, region }) {
    const productos = obtenerProductos();
    const productosActualizados = productos.map((producto) => {
        const comprado = carrito.find((item) =>
            item.nombre.toLocaleLowerCase('es') === producto.titulo.toLocaleLowerCase('es'),
        );
        return comprado
            ? { ...producto, stock: Math.max((producto.stock || 0) - comprado.cantidad, 0) }
            : producto;
    });
    const total = Math.max(subtotal + envio - descuento, 0);
    const pedidos = leerDatos('pedidosMangaVerse', []);
    const nuevoPedido = {
        id: `#${pedidos.length}`,
        usuario: localStorage.getItem('usuarioMangaVerse') || 'Invitado',
        productos: carrito,
        subtotal,
        envio,
        descuento,
        total,
        region,
        fecha: new Date().toLocaleDateString('es-CL'),
        estado: 'Completado',
    };

    guardarDatos('productosMangaVerse', productosActualizados);
    guardarDatos('pedidosMangaVerse', [...pedidos, nuevoPedido]);
    guardarDatos('ultimoPedidoMangaVerse', nuevoPedido);
    guardarDatos('carritoMangaVerse', []);
    localStorage.removeItem('cuponActivoMangaVerse');

    return nuevoPedido;
}
