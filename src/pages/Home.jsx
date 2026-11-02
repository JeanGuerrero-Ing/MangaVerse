import { useRef } from 'react'
import '../css/estilos.css'
import '../css/menu.css'
import '../css/index.css'
import BeneficioTienda from '../componentes/BeneficioTienda'
import { agregarAlCarrito, obtenerProductos } from '../data/almacenamiento'
import { mangas } from '../data/mangas'
import PrecioProducto from '../componentes/PrecioProducto'

function Home() {
    const pistaCarrusel = useRef(null);
    const productos = obtenerProductos();
    const obtenerManga = (id) => productos.find((manga) => manga.id === id) || mangas.find((manga) => manga.id === id);
    const agregarManga = (id) => agregarAlCarrito(obtenerManga(id));
    const mostrarPrecio = (id) => <PrecioProducto producto={obtenerManga(id)} />;
    const desplazarCarrusel = (direccion) => {
        const pista = pistaCarrusel.current;
        const tarjeta = pista?.querySelector('.recuadro-mangas');
        if (!pista || !tarjeta) return;

        const distancia = tarjeta.getBoundingClientRect().width + 20;
        if (direccion > 0 && pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 50) {
            pista.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (direccion < 0 && pista.scrollLeft <= 30) {
            pista.scrollTo({ left: pista.scrollWidth, behavior: 'smooth' });
        } else {
            pista.scrollBy({ left: distancia * direccion, behavior: 'smooth' });
        }
    };

    return (
        <main>
            {/* Sección de Presentación / Banner Informativo */}
            <section className="seccion-presentacion">
                <div className="contenedor-presentacion">
                    <div className="presentacion-imagen">
                        <img src="img/Imagen presentacion.jpg" alt="Leyendo manga" />
                    </div>
                    <div className="presentacion-texto">
                        <h2>¡Sumérgete en el fascinante mundo del manga!</h2>
                        <p>Descubre historias emocionantes, personajes inolvidables y aventuras que te atraparán desde la
                            primera página. Nuestra colección de mangas abarca todos los géneros: desde la acción trepidante
                            y la fantasía mágica hasta los romances más dulces y las comedias más divertidas.</p>
                        <p>Ya seas un ávido lector de manga o estés buscando tu próxima serie favorita, aquí encontrarás
                            algo que te encantará. Explora nuestra selección y déjate llevar por la narrativa visual y las
                            ilustraciones impresionantes que solo el manga puede ofrecer.</p>
                    </div>
                </div>
            </section>

            {/* Mangas nuevos (Carrusel en dos columnas) */}
            <section>
                <h1 className="titulo-seccion"><span>Mangas nuevos</span></h1>
            </section>

            <section className="seccion-mangas-nuevos">
                <div className="carrusel-contenedor-general">
                    {/* Botón Izquierda */}
                    <button type="button" className="carrusel-btn btn-prev" id="carrusel-prev" aria-label="Mangas anteriores" onClick={() => desplazarCarrusel(-1)}>&#10094;</button>

                    {/* Pista deslizante del carrusel */}
                    <div className="carrusel-pista" id="carrusel-pista" ref={pistaCarrusel}>

                        <div className="recuadro-mangas">
                            <div className="manga-info-izquierda">
                                <h1>Berserk 01</h1>
                                <p className="descripcion-manga">Edición definitiva de lujo</p>
                                <h2>{mostrarPrecio(6)}</h2>
                                <button className="anadir-carrito" onClick={() => agregarManga(6)}>Añadir al carrito</button>
                            </div>
                            <div className="manga-imagen-derecha">
                                <img src="img/Mangas/Berserk 01.jpg" alt="Berserk 01" />
                            </div>
                        </div>

                        <div className="recuadro-mangas">
                            <div className="manga-info-izquierda">
                                <h1>Blue lock 11</h1>
                                <p className="descripcion-manga">Arco de selección secundaria</p>
                                <h2>{mostrarPrecio(7)}</h2>
                                <button className="anadir-carrito" onClick={() => agregarManga(7)}>Añadir al carrito</button>
                            </div>
                            <div className="manga-imagen-derecha">
                                <img src="img/Mangas/Blue lock 11.jpg" alt="Blue lock 11" />
                            </div>
                        </div>

                        <div className="recuadro-mangas">
                            <div className="manga-info-izquierda">
                                <h1>Blue period 06</h1>
                                <p className="descripcion-manga">Exámenes de admisión de Tokio</p>
                                <h2>{mostrarPrecio(14)}</h2>
                                <button className="anadir-carrito" onClick={() => agregarManga(14)}>Añadir al carrito</button>
                            </div>
                            <div className="manga-imagen-derecha">
                                <img src="img/Mangas/Blue period 06.jpg" alt="Blue period 06" />
                            </div>
                        </div>

                        <div className="recuadro-mangas">
                            <div className="manga-info-izquierda">
                                <h1>Chainsaw man 24</h1>
                                <p className="descripcion-manga">Arco del Demonio de la Guerra</p>
                                <h2>{mostrarPrecio(3)}</h2>
                                <button className="anadir-carrito" onClick={() => agregarManga(3)}>Añadir al carrito</button>
                            </div>
                            <div className="manga-imagen-derecha">
                                <img src="img/Mangas/Chainsaw man 24.png" alt="Chainsaw man 24" />
                            </div>
                        </div>

                    </div>

                    {/* Botón Derecha */}
                    <button type="button" className="carrusel-btn btn-next" id="carrusel-next" aria-label="Mangas siguientes" onClick={() => desplazarCarrusel(1)}>&#10095;</button>
                </div>
            </section>

            {/* Beneficios */}
            <section>
                <div className="metricas">
                    <BeneficioTienda imagen="img/Dscto.png" titulo="Envío gratis" descripcion="Por compras superiores a $50.000" />
                    <BeneficioTienda imagen="img/Envio.png" titulo="Envíos a todo Chile" descripcion="Empaquetado seguro para tus mangas" />
                    <BeneficioTienda imagen="img/Tarjeta.png" titulo="3 cuotas sin interés" descripcion="Paga con Transbank en 3 cuotas sin interés" />
                </div>
            </section>

            {/* Sección de Presentación Inversa (Texto a la izquierda, Imagen a la derecha) */}
            <section className="seccion-presentacion">
                <div className="contenedor-presentacion inverso">
                    <div className="presentacion-texto">
                        <h2>¡Crea tu cuenta y vive Mangaverse al máximo!</h2>
                        <p>Si te encanta nuestra tienda y quieres llevar tu colección al siguiente nivel, te invitamos a
                            registrarte. Al crearte una sesión podrás acceder a descuentos exclusivos, ofertas especiales
                            para lectores frecuentes y enterarte antes que nadie de las nuevas llegadas.</p>
                        <p>Además, tu cuenta te permitirá guardar tus direcciones y seguir tus pedidos de manera mucho más
                            fácil y rápida. ¡Únete a nuestra comunidad y sé parte del universo Mangaverse!</p>
                    </div>
                    <div className="presentacion-imagen">
                        <img src="img/Invitacion registrate.jpg" alt="Colección de mangas" />
                    </div>
                </div>
            </section>

            {/* Más vendido */}
            <section>
                <h1 className="titulo-seccion"><span>Lo más vendido</span></h1>
            </section>

            <section className="seccion-mangas-masvendidos">
                <div className="recuadro-masvendidos">

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Demon slayer 08.png" alt="Manga" className="imagen-masvendido" />
                        <h1>Demon slayer 08</h1>
                        <p className="descripcion-manga">Tren infinito</p>
                        <h2>{mostrarPrecio(12)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(12)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Golden kamuy 01.png" alt="Manga" className="imagen-masvendido" />
                        <h1>Golden Kamuy 01</h1>
                        <p className="descripcion-manga">Búsqueda de oro en Hokkaido</p>
                        <h2>{mostrarPrecio(1)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(1)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Inuyasha 25.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>Inuyasha 25</h1>
                        <p className="descripcion-manga">La perla de Shikon</p>
                        <h2>{mostrarPrecio(5)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(5)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Jujutsu kaisen 29.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>Jujutsu kaisen 29</h1>
                        <p className="descripcion-manga">Batalla decisiva en Shinjuku</p>
                        <h2>{mostrarPrecio(2)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(2)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Mashle 17.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>Mashle 17</h1>
                        <p className="descripcion-manga">Magia y músculos</p>
                        <h2>{mostrarPrecio(8)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(8)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/My hero academia 05.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>My hero academia 05</h1>
                        <p className="descripcion-manga">Festival deportivo U.A.</p>
                        <h2>{mostrarPrecio(13)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(13)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/One piece 59.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>One piece 59</h1>
                        <p className="descripcion-manga">Guerra de Marineford</p>
                        <h2>{mostrarPrecio(4)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(4)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Rurouni kenshin 12.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>Rurouni kenshin 12</h1>
                        <p className="descripcion-manga">Kyoto en llamas</p>
                        <h2>{mostrarPrecio(11)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(11)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Saint seya the lost canva 01.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>Saint seya: The lost canva 01</h1>
                        <p className="descripcion-manga">Guerra Santa del Siglo XVIII</p>
                        <h2>{mostrarPrecio(10)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(10)}>Añadir al carrito</button>
                    </div>

                    <div className="recuadro-mangas-masvendidos">
                        <img src="img/Mangas/Shingeki 22.jpg" alt="Manga" className="imagen-masvendido" />
                        <h1>Shingeki no kyojin 22</h1>
                        <p className="descripcion-manga">Más allá de los muros</p>
                        <h2>{mostrarPrecio(9)}</h2>
                        <button className="anadir-carrito-chico" onClick={() => agregarManga(9)}>Añadir al carrito</button>
                    </div>

                </div>
            </section>

            {/* Opiniones */}
            <section>
                <h1 className="titulo-seccion titulo-reviews"><span>Reviews de nuestros clientes</span></h1>
            </section>

            <section className="seccion-testimonios">
                <div className="contenedor-testimonios">
                    <div className="recuadro-testimonio">
                        <p className="texto-testimonio">"¡Excelente servicio! Los tomos llegaron impecables, súper bien
                            protegidos y rápido a la casa."</p>
                        <strong>Ignacio V.</strong>
                    </div>
                    <div className="recuadro-testimonio">
                        <p className="texto-testimonio">"Tienen mucha variedad y los precios están súper buenos. Definitivamente
                            seguiré comprando aquí."</p>
                        <strong>Fernanda M.</strong>
                    </div>
                    <div className="recuadro-testimonio">
                        <p className="texto-testimonio">"Excelente atención y los pagos con Transbank sin problemas. 10/10 la
                            tienda."</p>
                        <strong>Matías S.</strong>
                    </div>
                    <div className="recuadro-testimonio">
                        <p className="texto-testimonio">"Pedí un par de mangas y llegaron al otro día. Muy buen servicio de
                            entrega en Santiago."</p>
                        <strong>Valentina R.</strong>
                    </div>
                    <div className="recuadro-testimonio">
                        <p className="texto-testimonio">"Los mangas vienen con sus protecciones perfectas, se nota que cuidan
                            los libros para los coleccionistas."</p>
                        <strong>Carlos P.</strong>
                    </div>
                    <div className="recuadro-testimonio">
                        <p className="texto-testimonio">"Muy buena atención cuando tuve dudas con mi pedido. De verdad se
                            agradece la buena disposición."</p>
                        <strong>Camila A.</strong>
                    </div>
                </div>
            </section>

        </main>
    );
}

export default Home;