import { render, screen } from '@testing-library/react';
import Blog from '../pages/Blog';

describe('Blog', () => {
    it('muestra dos artículos originales relacionados con el manga', () => {
        render(<Blog />);

        expect(screen.getByRole('heading', { name: 'Blog MangaVerse' })).toBeInTheDocument();
        expect(screen.getByRole('heading', {
            name: 'Shonen, shojo y seinen: una guía para elegir tu próxima lectura',
        })).toBeInTheDocument();
        expect(screen.getByRole('heading', {
            name: 'Cómo cuidar tu colección de manga y disfrutar cada tomo',
        })).toBeInTheDocument();
        expect(screen.getAllByRole('article')).toHaveLength(2);
    });
});
