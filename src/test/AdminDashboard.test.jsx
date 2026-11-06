import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../pages/admin-dashboard';
import { guardarDatos } from '../data/almacenamiento';

describe('AdminDashboard', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('resume ventas, pedidos pendientes e inventario', () => {
        guardarDatos('productosMangaVerse', [
            { id: 1, titulo: 'Berserk', precio: 10000, stock: 3, imagen: '/berserk.jpg' },
            { id: 2, titulo: 'One Piece', precio: 5000, stock: 4, imagen: '/one-piece.jpg' },
        ]);
        guardarDatos('pedidosMangaVerse', [
            { id: '#1', total: 10000, estado: 'Completado' },
            { id: '#2', total: 5000, estado: 'Pendiente' },
        ]);
        render(<MemoryRouter><AdminDashboard /></MemoryRouter>);

        expect(screen.getByText('$15.000')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Pedidos Pendientes' }).parentElement).toHaveTextContent('1');
        expect(screen.getByRole('heading', { name: 'Mangas en Stock' }).parentElement).toHaveTextContent('7');
        expect(screen.getByRole('img', { name: 'Berserk' })).toHaveAttribute('src', '/berserk.jpg');
    });

    it('descarga un reporte CSV de inventario y ventas', async () => {
        const usuario = userEvent.setup();
        guardarDatos('productosMangaVerse', [
            { id: 1, titulo: 'Berserk', precio: 10000, stock: 3, imagen: '/berserk.jpg' },
        ]);
        guardarDatos('pedidosMangaVerse', [{ id: '#1', usuario: 'ana', total: 10000, estado: 'Completado', productos: [] }]);
        const crearUrl = vi.fn(() => 'blob:reporte');
        const revocarUrl = vi.fn();
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: crearUrl });
        Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revocarUrl });
        const clickEnlace = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
        render(<MemoryRouter><AdminDashboard /></MemoryRouter>);

        await usuario.click(screen.getByRole('button', { name: 'Descargar reporte de inventario y ventas' }));

        expect(crearUrl).toHaveBeenCalledWith(expect.any(Blob));
        expect(clickEnlace).toHaveBeenCalled();
        expect(revocarUrl).toHaveBeenCalledWith('blob:reporte');
        clickEnlace.mockRestore();
    });
});
