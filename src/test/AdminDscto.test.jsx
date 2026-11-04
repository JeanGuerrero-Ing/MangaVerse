import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDscto from '../pages/admin-dscto';
import { guardarDatos } from '../data/almacenamiento';

async function crearCupon(usuario, { codigo = ' manga20 ', inicio = '2026-11-01', vencimiento = '2026-12-01' } = {}) {
    await usuario.click(screen.getByRole('button', { name: 'Crear código descuento' }));
    await usuario.type(screen.getByLabelText('Código del cupón'), codigo);
    await usuario.type(screen.getByLabelText('Descuento'), '20%');
    await usuario.type(screen.getByLabelText('Fecha de inicio'), inicio);
    await usuario.type(screen.getByLabelText('Fecha de vencimiento'), vencimiento);
    await usuario.click(screen.getByRole('button', { name: 'Guardar cupón' }));
}

describe('AdminDscto', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('crea cupones normalizando el código y permite activar y eliminar', async () => {
        const usuario = userEvent.setup();
        render(<MemoryRouter><AdminDscto /></MemoryRouter>);

        expect(screen.getByText('No hay cupones registrados actualmente.')).toBeInTheDocument();
        await crearCupon(usuario);

        expect(screen.getByRole('status')).toHaveTextContent('Cupón creado correctamente.');
        expect(screen.getByText('MANGA20')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('cuponesMangaVerse'))[0]).toMatchObject({
            codigo: 'MANGA20',
            descuento: '20%',
            estado: 'Activo',
        });

        await usuario.click(screen.getByRole('button', { name: 'Desactivar' }));
        expect(screen.getByText('Expirado')).toBeInTheDocument();
        await usuario.click(screen.getByRole('button', { name: 'Activar' }));
        expect(screen.getByText('Activo')).toBeInTheDocument();

        const confirmar = vi.spyOn(window, 'confirm').mockReturnValue(true);
        await usuario.click(screen.getByRole('button', { name: 'Eliminar' }));
        expect(confirmar).toHaveBeenCalledWith('¿Eliminar el cupón MANGA20?');
        expect(screen.getByText('No hay cupones registrados actualmente.')).toBeInTheDocument();
        confirmar.mockRestore();
    });

    it('rechaza fechas invertidas y códigos duplicados', async () => {
        const usuario = userEvent.setup();
        guardarDatos('cuponesMangaVerse', [{
            codigo: 'MANGA20',
            descuento: '20%',
            inicio: '2026-11-01',
            vencimiento: '2026-12-01',
            estado: 'Activo',
        }]);
        render(<MemoryRouter><AdminDscto /></MemoryRouter>);

        await crearCupon(usuario, { codigo: 'OTRO', inicio: '2026-12-01', vencimiento: '2026-11-01' });
        expect(screen.getByRole('status')).toHaveTextContent('La fecha de vencimiento no puede ser anterior a la fecha de inicio.');

        await usuario.click(screen.getByRole('button', { name: 'Cancelar' }));
        await crearCupon(usuario, { codigo: 'manga20' });
        expect(screen.getByRole('status')).toHaveTextContent('Ya existe un cupón con ese código.');
        expect(within(screen.getByRole('table')).getAllByText('MANGA20')).toHaveLength(1);
    });
});
