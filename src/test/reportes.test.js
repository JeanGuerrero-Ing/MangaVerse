import { crearReporteInventarioVentas } from '../data/reportes';

describe('crearReporteInventarioVentas', () => {
    it('genera un CSV de inventario y ventas con valores protegidos para hojas de cálculo', () => {
        const csv = crearReporteInventarioVentas(
            [
                { titulo: 'Manga "Uno"', stock: 3, precio: 10000, ofertaActiva: true, descuentoPorcentaje: 20 },
                { titulo: 'Manga sin oferta', stock: 0, precio: 5000, ofertaActiva: false },
            ],
            [{
                id: '#1',
                fecha: '04-11-2026',
                usuario: '=HYPERLINK("malicioso")',
                region: 'Metropolitana',
                total: 8000,
                estado: 'Completado',
                productos: [
                    { nombre: 'Manga "Uno"', precio: 8000, cantidad: 1 },
                    { titulo: '+Otro manga', precio: 1000, cantidad: 2 },
                    { cantidad: 0 },
                ],
            }],
            '04-11-2026',
        );

        expect(csv.startsWith('\uFEFF')).toBe(true);
        expect(csv).toContain('"Manga ""Uno"""');
        expect(csv).toContain('"\'=HYPERLINK(""malicioso"")"');
        expect(csv).toContain("\"'+Otro manga\"");
        expect(csv).toContain('"Manga sin oferta";"0";"5000";"5000";""');
        expect(csv).toContain('"Manga ""Uno""";"1";"8000"');
        expect(csv).toContain('"Producto sin nombre"');
        expect(csv).toContain('"8000";"Completado"');
    });

    it('incluye ventas de productos no inventariados y pedidos sin productos', () => {
        const csv = crearReporteInventarioVentas(
            [],
            [
                { id: '#1', total: 0, productos: [{ nombre: '  Manga externo  ', precio: '500', cantidad: '2' }] },
                { id: '#2', total: 1200, productos: [] },
                { id: '#3', total: 0 },
            ],
        );

        expect(csv).toContain('"Generado el"');
        expect(csv).toContain('"  Manga externo  ";"2";"1000"');
        expect(csv).toContain('"#2";"";"";"";"";"0";"0";"0";"1200";""');
        expect(csv).toContain('"#3";"";"";"";"";"0";"0";"0";"0";""');
    });
});
