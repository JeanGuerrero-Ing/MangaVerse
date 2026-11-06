import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import Registro from '../pages/Registro';

function RutaActual() {
    const ubicacion = useLocation();
    return <span data-testid="ruta-actual">{ubicacion.pathname}</span>;
}

function renderRegistro() {
    return render(
        <MemoryRouter initialEntries={['/registro']}>
            <Routes>
                <Route path="/registro" element={<Registro />} />
                <Route path="/login" element={<h1>Iniciar sesión</h1>} />
            </Routes>
            <RutaActual />
        </MemoryRouter>,
    );
}

async function completarRegistro(usuario, { nombreUsuario = 'ana', password = 'clave123', confirmar = password } = {}) {
    await usuario.type(screen.getByLabelText('Nombre'), 'Ana');
    await usuario.type(screen.getByLabelText('Apellido'), 'Manga');
    await usuario.type(screen.getByLabelText('Nombre de usuario'), nombreUsuario);
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@example.com');
    await usuario.type(screen.getByLabelText('Fecha de nacimiento'), '2000-01-01');
    await usuario.type(screen.getByLabelText('Contraseña'), password);
    await usuario.type(screen.getByLabelText('Confirmar contraseña'), confirmar);
    await usuario.click(screen.getByRole('button', { name: 'Registrarse' }));
}

describe('Registro', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('muestra un error cuando las contraseñas no coinciden', async () => {
        const usuario = userEvent.setup();
        renderRegistro();
        await completarRegistro(usuario, { confirmar: 'otra-clave' });
        expect(screen.getByRole('status')).toHaveTextContent('Las contraseñas no coinciden.');
    });

    it('evita registrar un nombre de usuario ya existente sin distinguir mayúsculas', async () => {
        const usuario = userEvent.setup();
        localStorage.setItem('cuentasMangaVerse', JSON.stringify([{ usuario: 'Ana' }]));
        renderRegistro();
        await completarRegistro(usuario, { nombreUsuario: 'ana' });
        expect(screen.getByRole('status')).toHaveTextContent('El nombre de usuario ya está registrado.');
    });

    it('guarda una cuenta nueva y programa la navegación al inicio de sesión', async () => {
        const usuario = userEvent.setup();
        renderRegistro();
        await completarRegistro(usuario);

        expect(screen.getByRole('status')).toHaveTextContent('¡Cuenta creada!');
        expect(JSON.parse(localStorage.getItem('cuentasMangaVerse'))[0]).toMatchObject({
            nombre: 'Ana',
            apellido: 'Manga',
            usuario: 'ana',
            correo: 'ana@example.com',
            rol: 'cliente',
        });
        expect(JSON.parse(localStorage.getItem('cuentaRegistrada'))).toMatchObject({ usuario: 'ana' });
        expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    });
});
