import { calcularPrecioOferta } from './almacenamiento';

function escaparCampoCsv(valor) {
    const texto = String(valor ?? '');
    const seguroParaHojaCalculo = typeof valor === 'string' && /^[\s]*[=+\-@]/.test(texto)
        ? `'${texto}`
        : texto;
    return `"${seguroParaHojaCalculo.replaceAll('"', '""')}"`;
}

function normalizarTitulo(titulo) {
    return String(titulo || '').trim().toLocaleLowerCase('es');
}

export function crearReporteInventarioVentas(productos, pedidos, fechaGeneracion) {
    const ventasPorManga = new Map();
    const totalCobradoPedidos = pedidos.reduce(
        (total, pedido) => total + Number(pedido.total || 0),
        0,
    );

    pedidos.forEach((pedido) => {
        (pedido.productos || []).forEach((item) => {
            const titulo = item.nombre || item.titulo || 'Producto sin nombre';
            const clave = normalizarTitulo(titulo);
            const cantidad = Number(item.cantidad) || 0;
            const precioUnitario = Number(item.precio) || 0;
            const venta = Math.round(precioUnitario * cantidad);
            const ventaExistente = ventasPorManga.get(clave) || {
                titulo,
                unidades: 0,
                total: 0,
            };

            ventaExistente.unidades += cantidad;
            ventaExistente.total += venta;
            ventasPorManga.set(clave, ventaExistente);
        });
    });

    const totalVentasProductos = [...ventasPorManga.values()]
        .reduce((total, venta) => total + venta.total, 0);
    const productosConVentas = new Map(
        productos.map((producto) => [normalizarTitulo(producto.titulo), producto]),
    );
    ventasPorManga.forEach((venta, clave) => {
        if (!productosConVentas.has(clave)) {
            productosConVentas.set(clave, { titulo: venta.titulo });
        }
    });

    const filas = [
        ['REPORTE DE INVENTARIO Y VENTAS'],
        ['Generado el', fechaGeneracion || new Date().toLocaleDateString('es-CL')],
        [],
        ['RESUMEN'],
        ['Métrica', 'Valor'],
        ['Pedidos registrados', pedidos.length],
        ['Ventas de productos (CLP)', totalVentasProductos],
        ['Total cobrado en pedidos (CLP)', totalCobradoPedidos],
        [],
        ['INVENTARIO ACTUAL'],
        ['Manga', 'Stock disponible', 'Precio original (CLP)', 'Precio actual (CLP)', 'Descuento (%)'],
        ...productos.map((producto) => [
            producto.titulo,
            Number(producto.stock) || 0,
            Number(producto.precio) || 0,
            calcularPrecioOferta(producto),
            producto.ofertaActiva ? Number(producto.descuentoPorcentaje) || 0 : '',
        ]),
        [],
        ['VENTAS POR MANGA'],
        ['Manga', 'Unidades vendidas', 'Ventas de productos (CLP)'],
        ...[...productosConVentas.keys()].map((clave) => {
            const venta = ventasPorManga.get(clave);
            const producto = productosConVentas.get(clave);
            return [producto.titulo, venta?.unidades || 0, venta?.total || 0];
        }),
        [],
        ['DETALLE DE VENTAS'],
        ['ID pedido', 'Fecha', 'Cliente', 'Región', 'Manga', 'Cantidad', 'Precio unitario (CLP)', 'Venta línea (CLP)', 'Total pedido (CLP)', 'Estado'],
        ...pedidos.flatMap((pedido) => {
            const items = pedido.productos || [];
            if (items.length === 0) {
                return [[
                    pedido.id || '',
                    pedido.fecha || '',
                    pedido.usuario || '',
                    pedido.region || '',
                    '',
                    0,
                    0,
                    0,
                    Number(pedido.total) || 0,
                    pedido.estado || '',
                ]];
            }

            return items.map((item, indice) => {
                const cantidad = Number(item.cantidad) || 0;
                const precioUnitario = Number(item.precio) || 0;
                return [
                    pedido.id || '',
                    pedido.fecha || '',
                    pedido.usuario || '',
                    pedido.region || '',
                    item.nombre || item.titulo || 'Producto sin nombre',
                    cantidad,
                    precioUnitario,
                    Math.round(precioUnitario * cantidad),
                    indice === 0 ? Number(pedido.total) || 0 : '',
                    pedido.estado || '',
                ];
            });
        }),
    ];

    return `\uFEFF${filas.map((fila) => fila.map(escaparCampoCsv).join(';')).join('\r\n')}`;
}
