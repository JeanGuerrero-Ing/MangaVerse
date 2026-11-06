import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPedidos from '../pages/admin-pedidos';
import { guardarDatos } from '../data/almacenamiento';

describe('AdminPedidos', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('muestra el estado vacío si todavía no hay pedidos', () => {
        render(<MemoryRouter><AdminPedidos /></MemoryRouter>);
        expect(screen.getByText('Todavía no hay pedidos registrados.')).toBeInTheDocument();
    });

    it('muestra pedidos, formatea totales y usa una región alternativa si falta', () => {
        guardarDatos('pedidosMangaVerse', [
            { id: '#12', usuario: 'ana', region: 'Metropolitana', total: 12990, estado: 'Completado' },
            { id: '#13', usuario: 'bea', total: 8000, estado: 'Pendiente' },
        ]);
        render(<MemoryRouter><AdminPedidos /></MemoryRouter>);

        const filas = within(screen.getByRole('table')).getAllByRole('row');
        expect(filas).toHaveLength(3);
        expect(filas[1]).toHaveTextContent(/#12anaMetropolitana\$12\.990Completado/);
        expect(filas[2]).toHaveTextContent(/#13beaNo especificada\$8\.000Pendiente/);
    });
});
