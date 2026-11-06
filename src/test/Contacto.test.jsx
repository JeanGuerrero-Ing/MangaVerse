import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contacto from '../pages/Contacto';

describe('Contacto', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('rechaza consultas de menores de edad', async () => {
        const usuario = userEvent.setup();
        render(<Contacto />);

        await usuario.type(screen.getByLabelText('Correo electrónico:'), 'ana@example.com');
        await usuario.type(screen.getByLabelText('Asunto:'), 'Consulta');
        await usuario.type(screen.getByLabelText('Mensaje:'), 'Quisiera más información');
        await usuario.type(screen.getByLabelText('Edad:'), '17');
        await usuario.selectOptions(screen.getByLabelText('Sexo:'), 'F');
        await usuario.click(screen.getByRole('button', { name: 'Enviar' }));

        expect(screen.getByRole('status')).toHaveTextContent('Solo mayores de edad pueden enviar consultas.');
        expect(localStorage.getItem('contactos')).toBeNull();
    });

    it('guarda consultas de adultos y permite listarlas', async () => {
        const usuario = userEvent.setup();
        render(<Contacto />);

        await usuario.type(screen.getByLabelText('Correo electrónico:'), 'ana@example.com');
        await usuario.type(screen.getByLabelText('Asunto:'), '  Mi pedido  ');
        await usuario.type(screen.getByLabelText('Mensaje:'), 'Necesito consultar por mi pedido');
        await usuario.type(screen.getByLabelText('Edad:'), '25');
        await usuario.selectOptions(screen.getByLabelText('Sexo:'), 'O');
        await usuario.click(screen.getByRole('button', { name: 'Enviar' }));

        expect(screen.getByRole('status')).toHaveTextContent('¡Mensaje de contacto enviado con éxito!');
        expect(JSON.parse(localStorage.getItem('contactos'))[0]).toMatchObject({
            asunto: 'Mi pedido',
            correo: 'ana@example.com',
            edad: 25,
            sexo: 'O',
        });

        await usuario.click(screen.getByRole('button', { name: 'Listar' }));
        expect(screen.getByRole('cell', { name: 'Mi pedido' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'ana@example.com' })).toBeInTheDocument();
    });

    it('muestra la lista vacía al solicitarla sin contactos guardados', async () => {
        const usuario = userEvent.setup();
        render(<Contacto />);
        await usuario.click(screen.getByRole('button', { name: 'Listar' }));
        expect(screen.getByText('No hay mensajes de contacto registrados.')).toBeInTheDocument();
    });
});
