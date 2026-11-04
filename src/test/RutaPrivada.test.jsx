import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RutaPrivada from '../componentes/RutaPrivada';
import { guardarDatos } from '../data/almacenamiento';

describe('RutaPrivada', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const renderRuta = (rol) => render(
        <MemoryRouter initialEntries={['/privada']}>
            <Routes>
                <Route path="/privada" element={
                    <RutaPrivada rol={rol}><h1>Contenido privado</h1></RutaPrivada>
                } />
                <Route path="/login" element={<h1>Iniciar sesión</h1>} />
            </Routes>
        </MemoryRouter>,
    );

    it('redirige al inicio de sesión si no hay cuenta activa', () => {
        renderRuta();
        expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    });

    it('permite el acceso cuando el rol requerido coincide', () => {
        localStorage.setItem('usuarioMangaVerse', 'admin');
        guardarDatos('cuentasMangaVerse', [{ usuario: 'admin', rol: 'admin' }]);

        renderRuta('admin');
        expect(screen.getByRole('heading', { name: 'Contenido privado' })).toBeInTheDocument();
    });

    it('redirige cuando la cuenta no tiene el rol requerido', () => {
        localStorage.setItem('usuarioMangaVerse', 'cliente');
        guardarDatos('cuentasMangaVerse', [{ usuario: 'cliente', rol: 'cliente' }]);

        renderRuta('admin');
        expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    });
});
