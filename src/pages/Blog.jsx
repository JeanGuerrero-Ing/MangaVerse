import TituloSeccion from '../componentes/TituloSeccion';
import '../css/estilos.css';
import '../css/menu.css';
import '../css/blog.css';

const articulos = [
    {
        categoria: 'Guía para lectores',
        fecha: '2 de noviembre de 2026',
        titulo: 'Shonen, shojo y seinen: una guía para elegir tu próxima lectura',
        introduccion: 'Los géneros demográficos del manga pueden ser una buena brújula para descubrir historias, aunque no definen por completo de qué trata una serie.',
        parrafos: [
            'Shonen y shojo suelen publicarse pensando en lectores jóvenes: el primero se asocia a menudo con aventuras, acción y amistad; el segundo, con frecuencia, explora relaciones y emociones. Son tendencias, no reglas: ambos pueden contar historias de muchos estilos.',
            'Seinen y josei se dirigen principalmente a públicos adultos y pueden abordar temas más complejos o cotidianos. Eso no significa que exista una única manera de leerlos: dentro de cada categoría hay comedia, misterio, fantasía, romance y mucho más.',
            'Una buena forma de elegir es combinar estas etiquetas con tus intereses. Si te atraen los mundos fantásticos, busca una sinopsis de aventura; si prefieres historias cercanas, prueba un drama o una comedia. La mejor guía es siempre el tema que te da curiosidad.',
        ],
    },
    {
        categoria: 'Consejos de colección',
        fecha: '2 de noviembre de 2026',
        titulo: 'Cómo cuidar tu colección de manga y disfrutar cada tomo',
        introduccion: 'Con unos cuidados sencillos puedes mantener tus tomos en buen estado y hacer que tu biblioteca sea más cómoda de recorrer.',
        parrafos: [
            'Guarda los mangas en un lugar seco, limpio y lejos de la luz directa del sol. El calor y la humedad pueden afectar el papel y las cubiertas; una estantería estable y ventilada ayuda a protegerlos.',
            'Para ordenar la colección, puedes agrupar los tomos por serie y mantenerlos en orden numérico. Si tienes varias series, reservar un espacio para cada una facilita encontrar el siguiente volumen y saber cuáles te faltan.',
            'Al leer, recuerda que la mayoría de los mangas conserva el sentido de lectura japonés: se comienza por el lado derecho y se avanza hacia la izquierda. Tómate tu tiempo, sigue los globos y disfruta cómo las viñetas guían el ritmo de la historia.',
        ],
    },
];

function Blog() {
    return (
        <main className="pagina-blog">
            <TituloSeccion>Blog MangaVerse</TituloSeccion>
            <section className="blog-contenido" aria-label="Artículos sobre manga">
                <div className="blog-introduccion">
                    <h2>Ideas y recomendaciones para lectores</h2>
                    <p>Explora artículos para conocer mejor el manga y disfrutar tu colección.</p>
                </div>
                <div className="blog-articulos">
                    {articulos.map((articulo) => (
                        <article className="blog-articulo" key={articulo.titulo}>
                            <div className="blog-articulo-meta">
                                <span className="blog-categoria">{articulo.categoria}</span>
                                <time>{articulo.fecha}</time>
                            </div>
                            <h2>{articulo.titulo}</h2>
                            <p className="blog-articulo-introduccion">{articulo.introduccion}</p>
                            {articulo.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Blog;
