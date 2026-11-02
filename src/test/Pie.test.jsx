import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Pie from '../componentes/Pie';

describe('Pie', () => {
    it('incluye un enlace al blog junto con la navegación principal', () => {
        render(<MemoryRouter><Pie /></MemoryRouter>);

        expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog');
        expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/');
        expect(screen.getByRole('link', { name: 'Catalogo' })).toHaveAttribute('href', '/catalogo');
    });
});
