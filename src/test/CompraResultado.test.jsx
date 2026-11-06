import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CompraError from '../pages/Compra-error';
import CompraExitosa from '../pages/Compra-exitosa';
import { guardarDatos } from '../data/almacenamiento';

describe('resultados de compra', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('muestra la información del último pedido confirmado', () => {
        guardarDatos('ultimoPedidoMangaVerse', {
            id: '#8',
            fecha: '04-11-2026',
            total: 12990,
            productos: [{ nombre: 'Berserk', imagen: '/berserk.jpg', cantidad: 1 }],
        });
        render(<CompraExitosa />);

        expect(screen.getByRole('heading', { name: 'Tu pedido ha sido recibido🎉' })).toBeInTheDocument();
        expect(screen.getByText('#8')).toBeInTheDocument();
        expect(screen.getByText('$12.990')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Berserk' })).toHaveAttribute('src', '/berserk.jpg');
    });

    it('usa el último pedido de la lista y muestra valores vacíos si no existe uno', () => {
        guardarDatos('pedidosMangaVerse', [{ id: '#3', productos: [], total: 0 }]);
        const { unmount } = render(<CompraExitosa />);
        expect(screen.getByText('#3')).toBeInTheDocument();
        unmount();
        localStorage.clear();
        render(<CompraExitosa />);
        expect(screen.getByText('Sin pedido')).toBeInTheDocument();
        expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('explica el rechazo y ofrece volver al checkout', () => {
        render(<MemoryRouter><CompraError /></MemoryRouter>);
        expect(screen.getByRole('alert')).toHaveTextContent('No pudimos procesar tu pago');
        expect(screen.getByRole('link', { name: 'Intentar nuevamente' })).toHaveAttribute('href', '/checkout');
    });
});
