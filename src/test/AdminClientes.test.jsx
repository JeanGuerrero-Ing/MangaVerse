import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminClientes from '../pages/Admin-clientes';
import { guardarDatos } from '../data/almacenamiento';

const cliente = {
    nombre: 'Ana',
    apellido: 'Manga',
    usuario: 'ana',
    correo: 'ana@example.com',
    fecha: '2000-01-01',
    rol: 'cliente',
};

function renderClientes() {
    return render(<MemoryRouter><AdminClientes /></MemoryRouter>);
}

describe('AdminClientes', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('muestra el estado vacío y distingue la cuenta administrativa', () => {
        renderClientes();
        expect(screen.getByText('No hay clientes registrados actualmente.')).toBeInTheDocument();

        guardarDatos('cuentasMangaVerse', [{ ...cliente, rol: 'admin', usuario: 'admin' }]);
        const { unmount } = renderClientes();
        expect(screen.getByText('Administrador')).toBeInTheDocument();
        expect(screen.getByText('Sistema')).toBeInTheDocument();
        unmount();
    });

    it('rechaza un alias duplicado y al guardar cambios sincroniza pedidos y sesión activa', async () => {
        const usuario = userEvent.setup();
        guardarDatos('cuentasMangaVerse', [
            cliente,
            { ...cliente, nombre: 'Bea', usuario: 'bea', correo: 'bea@example.com' },
        ]);
        guardarDatos('pedidosMangaVerse', [{ id: '#1', usuario: 'ana', total: 5000 }]);
        guardarDatos('cuentaRegistrada', cliente);
        localStorage.setItem('usuarioMangaVerse', 'ana');
        renderClientes();

        const filaAna = screen.getByRole('row', { name: /Ana Manga \(ana\)/ });
        await usuario.click(within(filaAna).getByRole('button', { name: 'Editar' }));
        await usuario.clear(screen.getByLabelText('Alias'));
        await usuario.type(screen.getByLabelText('Alias'), 'bea');
        await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }));
        expect(screen.getByRole('alert')).toHaveTextContent('Ese alias ya está en uso.');

        await usuario.clear(screen.getByLabelText('Alias'));
        await usuario.type(screen.getByLabelText('Alias'), 'ana-nueva');
        await usuario.clear(screen.getByLabelText('Nombre'));
        await usuario.type(screen.getByLabelText('Nombre'), 'Ana María');
        await usuario.click(screen.getByRole('button', { name: 'Guardar cambios' }));

        expect(screen.getByRole('status')).toHaveTextContent('Datos del cliente actualizados correctamente.');
        expect(JSON.parse(localStorage.getItem('cuentasMangaVerse'))[0]).toMatchObject({
            nombre: 'Ana María',
            usuario: 'ana-nueva',
        });
        expect(JSON.parse(localStorage.getItem('pedidosMangaVerse'))[0].usuario).toBe('ana-nueva');
        expect(JSON.parse(localStorage.getItem('cuentaRegistrada')).usuario).toBe('ana-nueva');
        expect(localStorage.getItem('usuarioMangaVerse')).toBe('ana-nueva');
    });

    it('muestra el historial vacío o los pedidos del cliente seleccionado', async () => {
        const usuario = userEvent.setup();
        guardarDatos('cuentasMangaVerse', [cliente]);
        guardarDatos('pedidosMangaVerse', [
            { id: '#1', usuario: 'ana', fecha: '04-11-2026', productos: [{ nombre: 'Berserk', cantidad: 2 }], total: 15000, estado: 'Completado' },
            { id: '#2', usuario: 'otra', fecha: '03-11-2026', productos: [], total: 0 },
        ]);
        const { unmount } = renderClientes();

        await usuario.click(screen.getByRole('button', { name: 'Historial' }));
        expect(screen.getByRole('dialog')).toHaveTextContent('Berserk × 2');
        expect(screen.getByRole('dialog')).not.toHaveTextContent('#2');
        await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cerrar' }));
        unmount();
        guardarDatos('pedidosMangaVerse', []);

        renderClientes();
        await usuario.click(screen.getByRole('button', { name: 'Historial' }));
        expect(screen.getByRole('dialog')).toHaveTextContent('Este cliente todavía no tiene compras registradas.');
    });

    it('elimina el cliente solo después de confirmar', async () => {
        const usuario = userEvent.setup();
        guardarDatos('cuentasMangaVerse', [cliente]);
        renderClientes();
        const confirmacion = vi.spyOn(window, 'confirm').mockReturnValue(false);

        await usuario.click(screen.getByRole('button', { name: 'Eliminar' }));
        expect(JSON.parse(localStorage.getItem('cuentasMangaVerse'))).toHaveLength(1);

        confirmacion.mockReturnValue(true);
        await usuario.click(screen.getByRole('button', { name: 'Eliminar' }));
        expect(JSON.parse(localStorage.getItem('cuentasMangaVerse'))).toEqual([]);
        expect(screen.getByText('No hay clientes registrados actualmente.')).toBeInTheDocument();
        confirmacion.mockRestore();
    });
});
