import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ResumenCompra from '../componentes/ResumenCompra';
import TituloSeccion from '../componentes/TituloSeccion';
import { formatearPrecio, guardarDatos, leerDatos } from '../data/almacenamiento';
import '../css/estilos.css'
import '../css/menu.css'
import '../css/carrito.css'

function Carrito() {
    const navegar = useNavigate();
    const [carrito, setCarrito] = useState(() => leerDatos('carritoMangaVerse', []));
    const [codigoCupon, setCodigoCupon] = useState(() =>
        leerDatos('cuponActivoMangaVerse', null)?.codigo || '',
    );
    const [cuponActivo, setCuponActivo] = useState(() =>
        leerDatos('cuponActivoMangaVerse', null),
    );
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('danger');
    const subtotal = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const envio = subtotal > 0 ? 3000 : 0;
    const descuento = cuponActivo
        ? cuponActivo.tipo === 'porcentaje'
            ? Math.round(subtotal * cuponActivo.valor / 100)
            : cuponActivo.valor
        : 0;

    const actualizarCarrito = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
        guardarDatos('carritoMangaVerse', nuevoCarrito);
    };

    const aplicarCupon = () => {
        const codigo = codigoCupon.trim().toUpperCase();
        const cupon = leerDatos('cuponesMangaVerse', [])
            .find((item) => item.codigo === codigo);
        const hoy = new Date().toISOString().slice(0, 10);

        if (!codigo) {
            setMensaje('Ingresa un código de descuento.');
        } else if (!cupon) {
            setMensaje('El código de descuento no existe.');
        } else if (cupon.estado !== 'Activo') {
            setMensaje('Este cupón está inactivo.');
        } else if (cupon.inicio && hoy < cupon.inicio) {
            setMensaje(`Este cupón estará vigente desde ${cupon.inicio}.`);
        } else if (cupon.vencimiento && hoy > cupon.vencimiento) {
            setMensaje('Este cupón ya venció.');
        } else {
            const valor = Number(cupon.descuento.replace(/[^\d]/g, ''));
            const tipo = cupon.descuento.includes('%') ? 'porcentaje' : 'monto';
            const descuentoGuardado = { codigo, valor, tipo };
            setCuponActivo(descuentoGuardado);
            guardarDatos('cuponActivoMangaVerse', descuentoGuardado);
            setMensaje(`Cupón ${codigo} aplicado.`);
            setTipoMensaje('success');
            return;
        }

        setTipoMensaje('danger');
    };

    const procederAlCheckout = () => {
        if (carrito.length === 0) {
            setMensaje('Tu carrito está vacío. Agrega mangas antes de pagar.');
            setTipoMensaje('warning');
            return;
        }
        navegar('/checkout');
    };

    return (
        <main>
            <TituloSeccion>Carrito de Compras</TituloSeccion>
            <section className="seccion-carrito">
                <Container fluid>
                    <Row className="g-4">
                        <Col lg={7}>
                            <Card className="carrito-tabla-box h-100">
                                <Card.Body>
                                    <table className="tabla-carrito">
                                        <thead>
                                            <tr>
                                                <th>Manga</th>
                                                <th>Cantidad</th>
                                                <th>Precio</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabla-carrito-cuerpo">
                                            {carrito.length === 0 ? (
                                                <tr><td colSpan="4">Tu carrito está vacío.</td></tr>
                                            ) : carrito.map((producto, indice) => (
                                                <tr key={producto.nombre}>
                                                    <td>
                                                        <div className="producto-info">
                                                            <img src={producto.imagen} alt={producto.nombre} />
                                                            <span>{producto.nombre}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="control-cantidad">
                                                            <Button size="sm" variant="outline-dark" aria-label={`Quitar uno de ${producto.nombre}`} onClick={() => actualizarCarrito(carrito.map((item, index) => index === indice ? { ...item, cantidad: item.cantidad - 1 } : item).filter((item) => item.cantidad > 0))}>-</Button>
                                                            <span>{producto.cantidad}</span>
                                                            <Button size="sm" variant="outline-dark" aria-label={`Agregar uno de ${producto.nombre}`} onClick={() => actualizarCarrito(carrito.map((item, index) => index === indice ? { ...item, cantidad: item.cantidad + 1 } : item))}>+</Button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {producto.precioOriginal > producto.precio && (
                                                            <del className="precio-producto-original">
                                                                {formatearPrecio(producto.precioOriginal * producto.cantidad)}
                                                            </del>
                                                        )}
                                                        <span className={producto.precioOriginal > producto.precio ? 'precio-producto-oferta' : ''}>
                                                            {formatearPrecio(producto.precio * producto.cantidad)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Button variant="danger" size="sm" onClick={() => actualizarCarrito(carrito.filter((_, index) => index !== indice))}>Eliminar</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={5}>
                            <Card className="carrito-resumen-box h-100">
                                <Card.Body>
                                    <ResumenCompra subtotal={subtotal} envio={envio} descuento={descuento} />
                                    <Form.Group className="cupon-container" controlId="codigo-descuento">
                                        <Form.Label>Introducir código de descuento</Form.Label>
                                        <div className="cupon-input-grupo">
                                            <Form.Control type="text" placeholder="Introducir código de descuento" value={codigoCupon} onChange={(evento) => setCodigoCupon(evento.target.value)} />
                                            <Button type="button" variant="dark" className="btn-aplicar-cupon" onClick={aplicarCupon}>
                                                Aplicar descuento
                                            </Button>
                                        </div>
                                    </Form.Group>
                                    {mensaje && <Alert variant={tipoMensaje} role="status">{mensaje}</Alert>}
                                    <div className="carrito-botones-accion">
                                        <Button id="btn-pagar" className="btn-pagar" onClick={procederAlCheckout}>Proceder al Pago</Button>
                                        <a href="/catalogo" className="btn-seguir-comprando">Seguir comprando</a>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    )
}

export default Carrito