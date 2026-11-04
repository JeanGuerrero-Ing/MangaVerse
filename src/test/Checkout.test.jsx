import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Checkout from '../pages/Checkout';
import { guardarDatos } from '../data/almacenamiento';
import { mangas } from '../data/mangas';

function RutaActual() {
    const ubicacion = useLocation();
    return <span data-testid="ruta-actual">{ubicacion.pathname}</span>;
}

function renderCheckout() {
    return render(
        <MemoryRouter initialEntries={['/checkout']}>
            <Routes>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/carrito" element={<h1>Carrito</h1>} />
                <Route path="/compra-error" element={<h1>Pago rechazado</h1>} />
                <Route path="/compra-exitosa" element={<h1>Compra confirmada</h1>} />
            </Routes>
            <RutaActual />
        </MemoryRouter>,
    );
}

async function completarFormulario(usuario, { rut = '12.345.678-5', telefono = '+56 9 1234 5678', tarjeta = '1234 5678 1234 5678' } = {}) {
    await usuario.type(screen.getByLabelText('Dirección de envío'), 'Av. Manga 123');
    await usuario.type(screen.getByLabelText('Número de contacto'), telefono);
    await usuario.type(screen.getByLabelText('RUT'), rut);
    await usuario.selectOptions(screen.getByLabelText('Región'), 'metropolitana');
    await usuario.type(screen.getByLabelText('Nombre del titular'), 'Ana Manga');
    await usuario.type(screen.getByLabelText('Número de tarjeta'), tarjeta);
    await usuario.type(screen.getByLabelText('Vencimiento'), '2027-12');
    await usuario.type(screen.getByLabelText('CVV'), '123');
    await usuario.click(screen.getByRole('button', { name: 'Confirmar compra' }));
}

describe('Checkout', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('ofrece volver al catálogo cuando el carrito está vacío', () => {
        renderCheckout();
        expect(screen.getByText('Tu carrito está vacío. Agrega productos antes de continuar.')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Ir al catálogo' })).toHaveAttribute('href', '/catalogo');
    });

    it('valida RUT y teléfono antes de procesar el pago', async () => {
        const usuario = userEvent.setup();
        guardarDatos('carritoMangaVerse', [{ nombre: 'Berserk', precio: 10000, cantidad: 1 }]);
        renderCheckout();

        await completarFormulario(usuario, { rut: '12345678-0' });
        expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un RUT chileno válido.');

        await usuario.clear(screen.getByLabelText('RUT'));
        await usuario.type(screen.getByLabelText('RUT'), '12.345.678-5');
        await usuario.clear(screen.getByLabelText('Número de contacto'));
        await usuario.type(screen.getByLabelText('Número de contacto'), '123');
        await usuario.click(screen.getByRole('button', { name: 'Confirmar compra' }));
        expect(screen.getByRole('alert')).toHaveTextContent('Ingresa un número de contacto válido.');
    });

    it('redirige si la tarjeta de demostración no es válida', async () => {
        const usuario = userEvent.setup();
        guardarDatos('carritoMangaVerse', [{ nombre: 'Berserk', precio: 10000, cantidad: 1 }]);
        renderCheckout();

        await completarFormulario(usuario, { tarjeta: '1111 1111 1111 1111' });
        expect(screen.getByRole('heading', { name: 'Pago rechazado' })).toBeInTheDocument();
        expect(localStorage.getItem('pedidosMangaVerse')).toBeNull();
    });

    it('registra la compra aprobada y navega a la confirmación', async () => {
        const usuario = userEvent.setup();
        guardarDatos('carritoMangaVerse', [{ nombre: mangas[0].titulo, precio: mangas[0].precio, cantidad: 1 }]);
        renderCheckout();

        await completarFormulario(usuario);

        expect(screen.getByRole('heading', { name: 'Compra confirmada' })).toBeInTheDocument();
        expect(screen.getByTestId('ruta-actual')).toHaveTextContent('/compra-exitosa');
        expect(JSON.parse(localStorage.getItem('pedidosMangaVerse'))).toHaveLength(1);
        expect(JSON.parse(localStorage.getItem('carritoMangaVerse'))).toEqual([]);
    });
});
