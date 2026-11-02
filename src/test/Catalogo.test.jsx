import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach } from 'vitest';
import Catalogo from '../pages/Catalogo';
import { mangas } from '../data/mangas';

const renderCatalogo = () => render(<MemoryRouter><Catalogo /></MemoryRouter>);
const contarTarjetas = () =>
    screen.queryAllByRole('button', { name: /añadir al carrito/i }).length;

describe('Catalogo', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('muestra todos los mangas al inicio', () => {
        renderCatalogo();
        expect(contarTarjetas()).toBe(mangas.length);
    });

    it('filtra por género', async () => {
        const usuario = userEvent.setup();
        renderCatalogo();

        const selectGenero = screen.getByDisplayValue('Todos los géneros');
        await usuario.selectOptions(selectGenero, 'seinen');

        const esperados = mangas.filter((m) => m.genero === 'seinen').length;
        expect(contarTarjetas()).toBe(esperados);
    });

    it('incluye géneros agregados desde el administrador en el filtro', async () => {
        const usuario = userEvent.setup();
        localStorage.setItem('generosMangaVerse', JSON.stringify([
            { valor: 'josei', etiqueta: 'Josei' },
        ]));
        localStorage.setItem('productosMangaVerse', JSON.stringify([
            {
                id: 100,
                titulo: 'Manga Josei',
                genero: 'josei',
                precio: 12000,
                stock: 5,
                img: '/josei.jpg',
            },
            {
                id: 101,
                titulo: 'Manga Shonen',
                genero: 'shonen',
                precio: 10000,
                stock: 5,
                img: '/shonen.jpg',
            },
        ]));
        renderCatalogo();

        await usuario.selectOptions(screen.getByLabelText('Género'), 'josei');

        expect(contarTarjetas()).toBe(1);
        expect(screen.getByRole('heading', { name: 'Manga Josei' })).toBeInTheDocument();
    });

    it('filtra por editorial', async () => {
        const usuario = userEvent.setup();
        renderCatalogo();

        const selectEditorial = screen.getByDisplayValue('Todas las editoriales');
        await usuario.selectOptions(selectEditorial, 'panini');

        const esperados = mangas.filter((m) => m.editorial === 'panini').length;
        expect(contarTarjetas()).toBe(esperados);
    });

    it('filtra los mangas por sus distintos rangos de precio', async () => {
        const usuario = userEvent.setup();
        renderCatalogo();

        const selectPrecio = screen.getByDisplayValue('Todos los precios');
        const rangos = [
            { valor: '0-9999', minimo: 0, maximo: 9999 },
            { valor: '10000-14999', minimo: 10000, maximo: 14999 },
            { valor: '15000-19999', minimo: 15000, maximo: 19999 },
            { valor: '20000+', minimo: 20000, maximo: Infinity },
        ];

        for (const rango of rangos) {
            await usuario.selectOptions(selectPrecio, rango.valor);
            const esperados = mangas.filter((manga) =>
                manga.precio >= rango.minimo && manga.precio <= rango.maximo,
            ).length;
            expect(contarTarjetas()).toBe(esperados);
            expect(esperados).toBeGreaterThan(0);
        }
    });

    it('no muestra mangas si ninguno cumple el rango de precio', async () => {
        const usuario = userEvent.setup();
        renderCatalogo();

        const selectPrecio = screen.getByDisplayValue('Todos los precios');
        await usuario.selectOptions(selectPrecio, '20000+');
        await usuario.selectOptions(screen.getByLabelText('Género'), 'shonen');

        expect(contarTarjetas()).toBe(0);
        expect(screen.getByRole('status')).toHaveTextContent('No encontramos mangas');
    });
});