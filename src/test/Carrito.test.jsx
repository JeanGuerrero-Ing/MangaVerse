import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Carrito from '../pages/Carrito';

function RutaActual() {
    const ubicacion = useLocation();
    return <span data-testid="ruta-actual">{ubicacion.pathname}</span>;
}

describe('Carrito', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('actualiza cantidades y elimina productos', async () => {
        const usuario = userEvent.setup();
        localStorage.setItem('carritoMangaVerse', JSON.stringify([
            { nombre: 'Berserk 01', precio: 10000, imagen: '/berserk.jpg', cantidad: 1 },
        ]));
        render(<MemoryRouter><Carrito /><RutaActual /></MemoryRouter>);

        await usuario.click(screen.getByRole('button', { name: 'Agregar uno de Berserk 01' }));
        expect(screen.getByText('2', { selector: 'span' })).toBeInTheDocument();
        expect(screen.getByText('$23.000')).toBeInTheDocument();

        await usuario.click(screen.getByRole('button', { name: 'Eliminar' }));
        expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    });

    it('registra la compra, vacía el carrito y avanza a la confirmación', async () => {
        const usuario = userEvent.setup();
        localStorage.setItem('carritoMangaVerse', JSON.stringify([
            { nombre: 'Berserk 01', precio: 10000, imagen: '/berserk.jpg', cantidad: 1 },
        ]));
        render(
            <MemoryRouter initialEntries={['/carrito']}>
                <Routes>
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/checkout" element={<h1>Finalizar compra</h1>} />
                </Routes>
                <RutaActual />
            </MemoryRouter>,
        );

        await usuario.click(screen.getByRole('button', { name: 'Proceder al Pago' }));

        expect(screen.getByRole('heading', { name: 'Finalizar compra' })).toBeInTheDocument();
        expect(screen.getByTestId('ruta-actual')).toHaveTextContent('/checkout');
        expect(localStorage.getItem('pedidosMangaVerse')).toBeNull();
        expect(JSON.parse(localStorage.getItem('carritoMangaVerse'))).toHaveLength(1);
    });
});
