import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ResumenCompra from '../componentes/ResumenCompra';
import TituloSeccion from '../componentes/TituloSeccion';
import { formatearPrecio, leerDatos } from '../data/almacenamiento';
import { registrarPedido } from '../data/checkout';
import '../css/estilos.css';
import '../css/menu.css';
import '../css/checkout.css';

const TARJETA_DEMO = '1234567812345678';

function rutEsValido(rut) {
    const limpio = rut.replace(/[.\s-]/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;

    const cuerpo = limpio.slice(0, -1);
    const digitoIngresado = limpio.slice(-1);
    let suma = 0;
    let multiplicador = 2;
    for (let indice = cuerpo.length - 1; indice >= 0; indice -= 1) {
        suma += Number(cuerpo[indice]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resultado = 11 - (suma % 11);
    const digitoCalculado = resultado === 11 ? '0' : resultado === 10 ? 'K' : String(resultado);
    return digitoIngresado === digitoCalculado;
}

function telefonoEsValido(telefono) {
    const digitos = telefono.replace(/\D/g, '');
    return digitos.length === 9 || (digitos.length === 11 && digitos.startsWith('56'));
}

function Checkout() {
    const navegar = useNavigate();
    const carrito = leerDatos('carritoMangaVerse', []);
    const subtotal = carrito.reduce((total, producto) => total + Number(producto.precio) * Number(producto.cantidad), 0);
    const envio = subtotal > 0 ? 3000 : 0;
    const cuponActivo = leerDatos('cuponActivoMangaVerse', null);
    const descuento = cuponActivo
        ? cuponActivo.tipo === 'porcentaje'
            ? Math.round(subtotal * Number(cuponActivo.valor) / 100)
            : Number(cuponActivo.valor)
        : 0;
    const [mensaje, setMensaje] = useState('');

    const confirmarCompra = (evento) => {
        evento.preventDefault();
        if (carrito.length === 0) {
            navegar('/carrito');
            return;
        }

        const datos = new FormData(evento.currentTarget);
        const rut = datos.get('rut').trim();
        const telefono = datos.get('telefono').trim();
        if (!rutEsValido(rut)) {
            setMensaje('Ingresa un RUT chileno válido.');
            return;
        }
        if (!telefonoEsValido(telefono)) {
            setMensaje('Ingresa un número de contacto válido.');
            return;
        }

        const numeroTarjeta = datos.get('numeroTarjeta').replace(/\D/g, '');
        if (numeroTarjeta !== TARJETA_DEMO) {
            navegar('/compra-error');
            return;
        }

        registrarPedido({
            carrito,
            subtotal,
            envio,
            descuento,
            region: datos.get('region'),
        });
        navegar('/compra-exitosa');
    };

    if (carrito.length === 0) {
        return (
            <main>
                <TituloSeccion>Finalizar compra</TituloSeccion>
                <section className="checkout-seccion">
                    <Alert variant="info">Tu carrito está vacío. Agrega productos antes de continuar.</Alert>
                    <Link to="/catalogo">Ir al catálogo</Link>
                </section>
            </main>
        );
    }

    return (
        <main>
            <TituloSeccion>Finalizar compra</TituloSeccion>
            <section className="checkout-seccion">
                <Container>
                    <Row className="g-4 justify-content-center">
                        <Col lg={7}>
                            <Card className="checkout-card">
                                <Card.Body>
                                    <h2>Datos de envío y pago</h2>
                                    <p className="checkout-ayuda">
                                        Modo de demostración: usa la tarjeta de prueba indicada para simular una compra aprobada.
                                    </p>
                                    {mensaje && <Alert variant="danger" role="alert">{mensaje}</Alert>}
                                    <Form onSubmit={confirmarCompra}>
                                        <h3>Datos de envío</h3>
                                        <Form.Group className="mb-3" controlId="checkout-direccion">
                                            <Form.Label>Dirección de envío</Form.Label>
                                            <Form.Control name="direccion" autoComplete="street-address" minLength={5} required />
                                        </Form.Group>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="checkout-telefono">
                                                    <Form.Label>Número de contacto</Form.Label>
                                                    <Form.Control
                                                        name="telefono"
                                                        type="tel"
                                                        autoComplete="tel"
                                                        placeholder="+56 9 1234 5678"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="checkout-rut">
                                                    <Form.Label>RUT</Form.Label>
                                                    <Form.Control name="rut" autoComplete="off" placeholder="12.345.678-5" required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-4" controlId="checkout-region">
                                            <Form.Label>Región</Form.Label>
                                            <Form.Select name="region" defaultValue="" required>
                                                <option value="" disabled>Selecciona una región</option>
                                                <option value="arica">Región de Arica y Parinacota</option>
                                                <option value="tarapaca">Región de Tarapacá</option>
                                                <option value="antofagasta">Región de Antofagasta</option>
                                                <option value="atacama">Región de Atacama</option>
                                                <option value="coquimbo">Región de Coquimbo</option>
                                                <option value="valparaiso">Región de Valparaíso</option>
                                                <option value="metropolitana">Región Metropolitana de Santiago</option>
                                                <option value="ohiggins">Región del Libertador Gral. Bernardo O'Higgins</option>
                                                <option value="maule">Región del Maule</option>
                                                <option value="nuble">Región de Ñuble</option>
                                                <option value="biobio">Región del Biobío</option>
                                                <option value="araucania">Región de La Araucanía</option>
                                                <option value="rios">Región de Los Ríos</option>
                                                <option value="lagos">Región de Los Lagos</option>
                                                <option value="aysen">Región de Aysén del Gral. Carlos Ibáñez del Campo</option>
                                                <option value="magallanes">Región de Magallanes y de la Antártica Chilena</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <h3>Tarjeta de prueba</h3>
                                        <p className="checkout-ayuda">
                                            Número de prueba: <strong>1234 5678 1234 5678</strong>. No uses datos de una tarjeta real.
                                        </p>
                                        <Form.Group className="mb-3" controlId="checkout-titular">
                                            <Form.Label>Nombre del titular</Form.Label>
                                            <Form.Control name="titular" autoComplete="cc-name" required />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="checkout-numero-tarjeta">
                                            <Form.Label>Número de tarjeta</Form.Label>
                                            <Form.Control
                                                name="numeroTarjeta"
                                                inputMode="numeric"
                                                autoComplete="off"
                                                maxLength={19}
                                                pattern="[0-9 ]{16,19}"
                                                placeholder="1234 5678 1234 5678"
                                                required
                                            />
                                        </Form.Group>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="checkout-vencimiento">
                                                    <Form.Label>Vencimiento</Form.Label>
                                                    <Form.Control name="vencimiento" type="month" autoComplete="cc-exp" required />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3" controlId="checkout-cvv">
                                                    <Form.Label>CVV</Form.Label>
                                                    <Form.Control
                                                        name="cvv"
                                                        type="password"
                                                        inputMode="numeric"
                                                        autoComplete="off"
                                                        minLength={3}
                                                        maxLength={4}
                                                        pattern="[0-9]{3,4}"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="checkout-acciones">
                                            <Button type="submit" variant="dark">Confirmar compra</Button>
                                            <Link to="/carrito">Volver al carrito</Link>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4}>
                            <Card className="checkout-card">
                                <Card.Body>
                                    <ResumenCompra subtotal={subtotal} envio={envio} descuento={descuento} />
                                    <h3 className="checkout-resumen-titulo">Productos</h3>
                                    <ul className="checkout-productos">
                                        {carrito.map((producto) => (
                                            <li key={producto.nombre}>
                                                <span>{producto.nombre} × {producto.cantidad}</span>
                                                <span>{formatearPrecio(producto.precio * producto.cantidad)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
}

export default Checkout;
