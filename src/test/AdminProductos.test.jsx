import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminProductos from '../pages/Admin-productos';
import { guardarDatos } from '../data/almacenamiento';

const producto = {
    id: 1,
    titulo: 'Berserk',
    precio: 10000,
    stock: 2,
    genero: 'seinen',
    imagen: '/berserk.jpg',
    ofertaActiva: false,
    descuentoPorcentaje: 0,
};

function renderProductos() {
    return render(<MemoryRouter><AdminProductos /></MemoryRouter>);
}

async function rellenarProducto(usuario, { titulo = 'Manga nuevo', genero = 'shonen' } = {}) {
    await usuario.type(screen.getByLabelText('Título'), titulo);
    await usuario.selectOptions(screen.getByLabelText('Género'), genero);
    await usuario.type(screen.getByLabelText('Precio'), '12000');
    await usuario.type(screen.getByLabelText('Stock'), '8');
}

describe('AdminProductos', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('edita los datos y la oferta de un producto existente', async () => {
        const usuario = userEvent.setup();
        guardarDatos('productosMangaVerse', [producto]);
        renderProductos();

        expect(screen.getByRole('alert')).toHaveTextContent('Berserk: 2 unidades');
        const fila = screen.getByRole('row', { name: /Berserk/ });
        await usuario.click(within(fila).getByRole('button', { name: 'Editar' }));
        await usuario.clear(screen.getByLabelText('Título'));
        await usuario.type(screen.getByLabelText('Título'), 'Berserk edición nueva');
        await usuario.clear(screen.getByLabelText('Stock'));
        await usuario.type(screen.getByLabelText('Stock'), '12');
        await usuario.click(screen.getByLabelText('Este producto tiene una oferta'));
        await usuario.type(screen.getByLabelText('Descuento (%)'), '25');
        await usuario.click(screen.getByRole('button', { name: 'Guardar', exact: true }));

        expect(screen.getByText('Producto guardado.')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('productosMangaVerse'))[0]).toMatchObject({
            id: 1,
            titulo: 'Berserk edición nueva',
            stock: 12,
            ofertaActiva: true,
            descuentoPorcentaje: 25,
            imagen: '/berserk.jpg',
        });
    });

    it('valida imagen, crea un género nuevo y guarda un producto con portada', async () => {
        const usuario = userEvent.setup();
        guardarDatos('productosMangaVerse', []);
        renderProductos();

        await usuario.click(screen.getByRole('button', { name: '+ Agregar Nuevo Manga' }));
        await rellenarProducto(usuario);
        await usuario.click(screen.getByRole('button', { name: 'Guardar', exact: true }));
        expect(screen.getByText('Selecciona una imagen para el manga.')).toBeInTheDocument();

        await usuario.click(screen.getByRole('button', { name: 'Agregar nuevo género' }));
        await usuario.click(screen.getByRole('button', { name: 'Guardar género' }));
        expect(screen.getByText('Escribe el nombre del género.')).toBeInTheDocument();

        await usuario.type(screen.getByLabelText('Nombre del nuevo género'), 'Fantasía');
        await usuario.click(screen.getByRole('button', { name: 'Guardar género' }));
        expect(JSON.parse(localStorage.getItem('generosMangaVerse'))).toContainEqual({
            valor: 'fantasia',
            etiqueta: 'Fantasía',
        });
        await usuario.selectOptions(screen.getByLabelText('Género'), 'fantasia');

        const archivo = new File(['portada'], 'portada.png', { type: 'image/png' });
        await usuario.upload(screen.getByLabelText('Imagen del manga'), archivo);
        await usuario.click(screen.getByRole('button', { name: 'Guardar', exact: true }));

        expect(await screen.findByText('Producto guardado.')).toBeInTheDocument();
        const guardado = JSON.parse(localStorage.getItem('productosMangaVerse'))[0];
        expect(guardado).toMatchObject({
            titulo: 'Manga nuevo',
            genero: 'fantasia',
            precio: 12000,
            stock: 8,
            ofertaActiva: false,
            descuentoPorcentaje: 0,
        });
        expect(guardado.imagen).toMatch(/^data:image\/png;base64,/);
    });

    it('rechaza archivos que no son imágenes y portadas mayores a 1 MB', async () => {
        const usuario = userEvent.setup();
        guardarDatos('productosMangaVerse', []);
        renderProductos();
        await usuario.click(screen.getByRole('button', { name: '+ Agregar Nuevo Manga' }));
        await rellenarProducto(usuario);

        const inputImagen = screen.getByLabelText('Imagen del manga');
        fireEvent.change(inputImagen, {
            target: { files: [new File(['texto'], 'portada.txt', { type: 'text/plain' })] },
        });
        await usuario.click(screen.getByRole('button', { name: 'Guardar', exact: true }));
        expect(screen.getByRole('alert')).toHaveTextContent('Selecciona un archivo de imagen válido.');

        fireEvent.change(inputImagen, {
            target: { files: [new File([new Uint8Array(1024 * 1024 + 1)], 'portada.png', { type: 'image/png' })] },
        });
        await usuario.click(screen.getByRole('button', { name: 'Guardar', exact: true }));
        expect(screen.getByRole('alert')).toHaveTextContent('La imagen debe pesar 1 MB o menos.');
        expect(JSON.parse(localStorage.getItem('productosMangaVerse'))).toEqual([]);
    });

    it('elimina productos y permite descargar el reporte de stock', async () => {
        const usuario = userEvent.setup();
        guardarDatos('productosMangaVerse', [producto]);
        const crearUrl = vi.fn(() => 'blob:inventario');
        const revocarUrl = vi.fn();
        Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: crearUrl });
        Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revocarUrl });
        const clickEnlace = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
        renderProductos();

        await usuario.click(screen.getByRole('button', { name: 'Descargar reporte de stock' }));
        expect(crearUrl).toHaveBeenCalledWith(expect.any(Blob));
        expect(clickEnlace).toHaveBeenCalled();
        expect(revocarUrl).toHaveBeenCalledWith('blob:inventario');

        await usuario.click(screen.getByRole('button', { name: 'Eliminar' }));
        expect(JSON.parse(localStorage.getItem('productosMangaVerse'))).toEqual([]);
        expect(screen.getByText('No hay mangas en el inventario.')).toBeInTheDocument();
        clickEnlace.mockRestore();
    });
});
