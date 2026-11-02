import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatearPrecio, leerDatos, obtenerProductos } from '../data/almacenamiento';
import { crearReporteInventarioVentas } from '../data/reportes';
import CerrarSesion from '../componentes/CerrarSesion';
import PrecioProducto from '../componentes/PrecioProducto';
import '../css/estilos.css'
import '../css/menu.css'
import '../css/admin.css'

function AdminDashboard() {
    const pedidos = leerDatos('pedidosMangaVerse', []);
    const productos = obtenerProductos();
    const ventas = pedidos.reduce((total, pedido) => total + Number(pedido.total || 0), 0);
    const pendientes = pedidos.filter((pedido) => pedido.estado !== 'Completado').length;
    const stock = productos.reduce((total, producto) => total + Number(producto.stock || 0), 0);
    const descargarReporte = () => {
        const contenido = crearReporteInventarioVentas(productos, pedidos);
        const archivo = new Blob([contenido], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(archivo);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `reporte-inventario-ventas-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <main className="seccion-admin">
                <div className="contenedor-admin">

                    {/* Menú Lateral */}
                    <aside className="panel-menu-admin">
                        <h1>Menú Admin</h1>
                        <ul className="admin-links-menu">
                            <li><a href="/admin-dashboard" className="activo">Dashboard</a></li>
                            <li><a href="/admin-productos">Gestión de Productos</a></li>
                            <li><a href="/admin-pedidos">Pedidos Recientes</a></li>
                            <li><a href="/admin-dscto">Cupones y Descuentos</a></li>
                            <li><a href="/admin-clientes">Clientes Registrados</a></li>
                            <li><a href="/">Salir al sitio</a></li>
                            <li><CerrarSesion /></li>
                        </ul>
                    </aside>

                    {/* Área de Contenido Principal */}
                    <section className="admin-contenido-box">

                        <div className="admin-header-seccion">
                            <h2>Bienvenido al Panel de Control</h2>
                            <p>Selecciona una opción del menú lateral para gestionar la tienda.</p>
                            <Button type="button" variant="success" onClick={descargarReporte}>
                                Descargar reporte de inventario y ventas
                            </Button>
                        </div>

                        {/* Resumen de métricas */}
                        <div className="admin-metricas-grid">
                            <div className="metrica-card">
                                <h3>Ventas del Mes</h3>
                                <p className="valor-metrica">{formatearPrecio(ventas)}</p>
                            </div>
                            <div className="metrica-card">
                                <h3>Pedidos Pendientes</h3>
                                <p className="valor-metrica">{pendientes}</p>
                            </div>
                            <div className="metrica-card">
                                <h3>Mangas en Stock</h3>
                                <p className="valor-metrica">{stock}</p>
                            </div>
                        </div>

                        {/* Tabla de Inventario Rápido */}
                        <div className="admin-tabla-container">
                            <div className="tabla-acciones-superior">
                                <h3>Inventario Rápido</h3>
                                <Link to="/admin-productos" className="btn-nuevo-producto">Gestionar productos</Link>
                            </div>

                            <table className="tabla-admin-inventario">
                                <thead>
                                    <tr>
                                        <th>Portada</th>
                                        <th>Título</th>
                                        <th>Precio</th>
                                        <th>Stock</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.slice(0, 5).map((producto) => (
                                        <tr key={producto.id}>
                                            <td><img src={producto.imagen || producto.img} alt={producto.titulo} className="img-tabla-manga" /></td>
                                            <td>{producto.titulo}</td>
                                            <td><PrecioProducto producto={producto} /></td>
                                            <td>{producto.stock}</td>
                                            <td><Link to="/admin-productos" className="btn-accion editar">Editar</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </section>
                </div>
            </main>
        </>
    )
}

export default AdminDashboard