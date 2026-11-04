import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../pages/Home';

describe('Home', () => {
    beforeEach(() => {
        localStorage.clear();
        Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
            configurable: true,
            value: vi.fn(),
        });
        Object.defineProperty(HTMLElement.prototype, 'scrollBy', {
            configurable: true,
            value: vi.fn(),
        });
    });

    afterEach(() => {
        delete HTMLElement.prototype.scrollTo;
        delete HTMLElement.prototype.scrollBy;
    });

    it('agrega al carrito los mangas de ambas secciones', () => {
        render(<Home />);

        screen.getAllByRole('button', { name: 'Añadir al carrito' }).forEach((boton) => {
            fireEvent.click(boton);
        });

        const carrito = JSON.parse(localStorage.getItem('carritoMangaVerse'));
        expect(carrito).toHaveLength(14);
        expect(carrito[0]).toMatchObject({ nombre: 'Berserk 01', cantidad: 1 });
    });

    it('desplaza el carrusel en ambos sentidos y vuelve al inicio o al final en los extremos', () => {
        render(<Home />);
        const pista = document.getElementById('carrusel-pista');
        const tarjeta = pista.querySelector('.recuadro-mangas');
        vi.spyOn(tarjeta, 'getBoundingClientRect').mockReturnValue({ width: 100 });
        Object.defineProperties(pista, {
            scrollLeft: { value: 100, writable: true, configurable: true },
            clientWidth: { value: 500, configurable: true },
            scrollWidth: { value: 1000, configurable: true },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Mangas siguientes' }));
        fireEvent.click(screen.getByRole('button', { name: 'Mangas anteriores' }));
        expect(pista.scrollBy).toHaveBeenNthCalledWith(1, { left: 120, behavior: 'smooth' });
        expect(pista.scrollBy).toHaveBeenNthCalledWith(2, { left: -120, behavior: 'smooth' });

        pista.scrollLeft = 700;
        fireEvent.click(screen.getByRole('button', { name: 'Mangas siguientes' }));
        expect(pista.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'smooth' });

        pista.scrollLeft = 0;
        fireEvent.click(screen.getByRole('button', { name: 'Mangas anteriores' }));
        expect(pista.scrollTo).toHaveBeenLastCalledWith({ left: 1000, behavior: 'smooth' });
    });
});
