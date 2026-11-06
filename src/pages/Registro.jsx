import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { guardarDatos, leerDatos } from '../data/almacenamiento';
import '../css/estilos.css'
import '../css/menu.css'
import '../css/registro.css'

function Registro() {
    const navegar = useNavigate();
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('danger');

    const registrarCuenta = (evento) => {
        evento.preventDefault();
        const datos = new FormData(evento.currentTarget);
        const pass = datos.get('password');
        if (pass !== datos.get('confirmar')) {
            setTipoMensaje('danger');
            setMensaje('Las contraseñas no coinciden.');
            return;
        }

        const cuentas = leerDatos('cuentasMangaVerse', []);
        const usuario = datos.get('usuario').trim();
        if (cuentas.some((cuenta) => cuenta.usuario.toLowerCase() === usuario.toLowerCase())) {
            setTipoMensaje('danger');
            setMensaje('El nombre de usuario ya está registrado.');
            return;
        }

        const cuenta = {
            nombre: datos.get('nombre').trim(),
            apellido: datos.get('apellido').trim(),
            usuario,
            correo: datos.get('correo').trim(),
            fecha: datos.get('fecha'),
            pass,
            rol: 'cliente',
        };
        guardarDatos('cuentasMangaVerse', [...cuentas, cuenta]);
        guardarDatos('cuentaRegistrada', cuenta);
        setTipoMensaje('success');
        setMensaje('¡Cuenta creada! Te llevaremos al inicio de sesión.');
        setTimeout(() => navegar('/login'), 900);
    };

    return (
        <>
            <main className="registro-contenedor">
                <div className="registro-box">
                    {/* Columna Izquierda: Imagen del Logo */}
                    <div className="registro-imagen">
                        <img src="img/Logo.png" alt="MangaVerse Logo" />
                    </div>

                    {/* Columna Derecha: Formulario de Registro */}
                    <div className="registro-formulario">
                        <h2>Crear Cuenta</h2>
                        <p>Únete a MangaVerse para gestionar tu catálogo, compras y recibir descuentos.</p>

                        {/* Caja dinámica para alertas de validación */}
                        {mensaje && <Alert id="alerta-box" variant={tipoMensaje} role="status">{mensaje}</Alert>}

                        <form id="form-registro" onSubmit={registrarCuenta}>
                            <div className="campo-grupo">
                                <label htmlFor="reg-nombre">Nombre</label>
                                <input type="text" id="reg-nombre" name="nombre" placeholder="Ej: JeanToFranku" required />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="reg-apellido">Apellido</label>
                                <input type="text" id="reg-apellido" name="apellido" placeholder="Ej: Warrior" required />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="reg-usuario">Nombre de usuario</label>
                                <input type="text" id="reg-usuario" name="usuario" placeholder="Ej: Yofrein" required />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="reg-correo">Correo electrónico</label>
                                <input type="email" id="reg-correo" name="correo" placeholder="ejemplo@duocuc.cl" required />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="reg-fecha">Fecha de nacimiento</label>
                                <input type="date" id="reg-fecha" name="fecha" required />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="reg-contrasena">Contraseña</label>
                                <input type="password" id="reg-contrasena" name="password" placeholder="••••••••" required />
                            </div>

                            <div className="campo-grupo">
                                <label htmlFor="reg-confirmar-contrasena">Confirmar contraseña</label>
                                <input type="password" id="reg-confirmar-contrasena" name="confirmar" placeholder="••••••••" required />
                            </div>

                            <button type="submit" className="btn-registro">Registrarse</button>

                            <p className="texto-login">
                                ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Registro