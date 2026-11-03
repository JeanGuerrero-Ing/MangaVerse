import { Link } from 'react-router-dom';
import TituloSeccion from '../componentes/TituloSeccion';
import '../css/estilos.css';
import '../css/menu.css';
import '../css/checkout.css';

function CompraError() {
    return (
        <main>
            <TituloSeccion>Error en la compra</TituloSeccion>
            <section className="checkout-seccion">
                <div className="checkout-resultado checkout-resultado-error" role="alert">
                    <h2>No pudimos procesar tu pago</h2>
                    <p>Verifica los datos de la tarjeta de prueba e intenta nuevamente.</p>
                    <Link className="btn btn-dark" to="/checkout">Intentar nuevamente</Link>
                </div>
            </section>
        </main>
    );
}

export default CompraError;
