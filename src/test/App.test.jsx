import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('inicializa la cuenta administradora y muestra la página principal', () => {
        render(<MemoryRouter><App /></MemoryRouter>);

        expect(screen.getByRole('heading', { name: /Sumérgete en el fascinante mundo del manga/i })).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('cuentasMangaVerse'))).toEqual([
            expect.objectContaining({ usuario: 'admin', rol: 'admin' }),
        ]);
    });

    it('agrega un producto destacado al carrito', async () => {
        const usuario = userEvent.setup();
        render(<MemoryRouter><App /></MemoryRouter>);

        await usuario.click(screen.getAllByRole('button', { name: 'Añadir al carrito' })[0]);
        expect(JSON.parse(localStorage.getItem('carritoMangaVerse'))[0]).toMatchObject({
            nombre: 'Berserk 01',
            cantidad: 1,
        });
    });
});
