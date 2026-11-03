import { formatearPrecio, leerDatos } from '../data/almacenamiento';
import '../css/estilos.css'
import '../css/menu.css'
import '../css/carrito.css'
import '../css/compra-exitosa.css'

function CompraExitosa() {
    const pedido = leerDatos('ultimoPedidoMangaVerse', null)
        || leerDatos('pedidosMangaVerse', []).at(-1);

    return (
        <>
            <main>
                <section className="seccion-exito">
                    <div className="exito-titulo">
                        <h3>¡Muchas gracias por tu compra!</h3>
                        <h1>Tu pedido ha sido recibido🎉</h1>
                    </div>

                    {/* Contenedor dinámico de miniaturas de productos */}
                    <div id="exito-productos-container" className="exito-productos-grid">
                        {pedido?.productos.map((producto) => (
                            <div className="exito-item-miniatura" key={producto.nombre}>
                                <img src={producto.imagen || producto.img} alt={producto.nombre || producto.titulo} />
                                <span className="exito-badge-cantidad">{producto.cantidad}</span>
                            </div>
                        ))}
                    </div>

                    {/* Detalles del pedido */}
                    <div className="exito-detalles">
                        <div className="exito-detalle-linea">
                            <span>Numero de pedido:</span>
                            <span id="detalle-codigo">{pedido?.id || 'Sin pedido'}</span>
                        </div>
                        <div className="exito-detalle-linea">
                            <span>Fecha:</span>
                            <span id="detalle-fecha">{pedido?.fecha || '—'}</span>
                        </div>
                        <div className="exito-detalle-linea">
                            <span>Total:</span>
                            <span id="detalle-total">{formatearPrecio(pedido?.total || 0)}</span>
                        </div>
                        <div className="exito-detalle-linea">
                            <span>Método de pago:</span>
                            <span>Tarjeta de prueba</span>
                        </div>
                    </div>

                    <div>
                        <a href="/" className="btn-historial">Volver al inicio</a>
                    </div>
                </section>
            </main>
        </>
    )
}

export default CompraExitosa