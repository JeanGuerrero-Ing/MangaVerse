import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { agregarAlCarrito, calcularPrecioOferta, obtenerGeneros, obtenerProductos } from '../data/almacenamiento';
import FiltroCatalogo from '../componentes/FiltroCatalogo';
import MensajeVacio from '../componentes/MensajeVacio';
import TarjetaManga from '../componentes/TarjetaManga';
import TituloSeccion from '../componentes/TituloSeccion';
import '../css/estilos.css';
import '../css/menu.css';
import '../css/catalogo.css';

function Catalogo() {
    const [parametros] = useSearchParams();
    const [mangas] = useState(() => obtenerProductos());
    const termino = (parametros.get('buscar') || '').toLocaleLowerCase('es');
    const [genero, setGenero] = useState('');
    const [editorial, setEditorial] = useState('');
    const [rangoPrecio, setRangoPrecio] = useState('');
    const [autor, setAutor] = useState('');

    const cumplePrecio = (precio) => {
        if (rangoPrecio === '') return true;
        if (rangoPrecio.endsWith('+')) return precio >= parseInt(rangoPrecio);
        const [min, max] = rangoPrecio.split('-').map(Number);
        return precio >= min && precio <= max;
    };

    const mangasFiltrados = mangas.filter((m) =>
        m.titulo.toLocaleLowerCase('es').includes(termino) &&
        (genero === '' || m.genero === genero) &&
        (editorial === '' || m.editorial === editorial) &&
        (autor === '' || m.autor === autor) &&
        cumplePrecio(calcularPrecioOferta(m))
    );

    const manejarAnadirCarrito = (manga) => {
        agregarAlCarrito(manga);
    };

    const opcionesGenero = [
        { valor: '', etiqueta: 'Todos los géneros' },
        ...obtenerGeneros(),
    ];
    const opcionesEditorial = [
        { valor: '', etiqueta: 'Todas las editoriales' },
        { valor: 'ivrea', etiqueta: 'Ivrea' },
        { valor: 'panini', etiqueta: 'Panini Manga' },
        { valor: 'norma', etiqueta: 'Norma Editorial' },
        { valor: 'ovni', etiqueta: 'Ovni Press' },
        { valor: 'distrito', etiqueta: 'Distrito Manga' },
        { valor: 'milkyway', etiqueta: 'Milky Way Ediciones' },
        { valor: 'planeta', etiqueta: 'Planeta Cómic' },
        { valor: 'viz', etiqueta: 'Viz Media' },
        { valor: 'arechi', etiqueta: 'Arechi Manga' },
        { valor: 'satori', etiqueta: 'Satori Ediciones' },
    ];
    const opcionesPrecio = [
        { valor: '', etiqueta: 'Todos los precios' },
        { valor: '0-9999', etiqueta: 'Hasta $9.999' },
        { valor: '10000-14999', etiqueta: '$10.000 - $14.999' },
        { valor: '15000-19999', etiqueta: '$15.000 - $19.999' },
        { valor: '20000+', etiqueta: '$20.000 o más' },
    ];
    const opcionesAutor = [
        { valor: '', etiqueta: 'Todos los autores' },
        { valor: 'kentaro-miura', etiqueta: 'Kentaro Miura (Berserk)' },
        { valor: 'muneyuki-kaneshiro', etiqueta: 'Muneyuki Kaneshiro (Blue Lock)' },
        { valor: 'tsubasa-yamaguchi', etiqueta: 'Tsubasa Yamaguchi (Blue Period)' },
        { valor: 'tatsuki-fujimoto', etiqueta: 'Tatsuki Fujimoto (Chainsaw Man)' },
        { valor: 'koyoharu-gotouge', etiqueta: 'Koyoharu Gotouge (Demon Slayer)' },
        { valor: 'satoru-noda', etiqueta: 'Satoru Noda (Golden Kamuy)' },
        { valor: 'rumiko-takahashi', etiqueta: 'Rumiko Takahashi (Inuyasha)' },
        { valor: 'gege-akutami', etiqueta: 'Gege Akutami (Jujutsu Kaisen)' },
        { valor: 'hajime-komoto', etiqueta: 'Hajime Komoto (Mashle)' },
        { valor: 'kohei-horikoshi', etiqueta: 'Kohei Horikoshi (My Hero Academia)' },
        { valor: 'eiichiro-oda', etiqueta: 'Eiichiro Oda (One Piece)' },
        { valor: 'nobuhiro-watsuki', etiqueta: 'Nobuhiro Watsuki (Rurouni Kenshin)' },
        { valor: 'masami-kurumada', etiqueta: 'Masami Kurumada (Saint Seiya)' },
        { valor: 'hajime-isayama', etiqueta: 'Hajime Isayama (Shingeki no Kyojin)' },
    ];

    return (
        <>
            <TituloSeccion>Catálogo</TituloSeccion>
            
            <main className="seccion-catalogo">
                <Container fluid>
                    <Row className="g-4">
                        <Col lg={3} className="columna-filtros">
                            <section className="panel-filtros">
                                <h2 className="panel-filtros-titulo">Filtros</h2>
                                <FiltroCatalogo id="cboGenero" titulo="Género" valor={genero} opciones={opcionesGenero} onCambiar={setGenero} />
                                <FiltroCatalogo id="cboEditorial" titulo="Editorial" valor={editorial} opciones={opcionesEditorial} onCambiar={setEditorial} />
                                <FiltroCatalogo id="cboPrecio" titulo="Rango de precio" valor={rangoPrecio} opciones={opcionesPrecio} onCambiar={setRangoPrecio} />
                                <FiltroCatalogo id="cboAutor" titulo="Autor" valor={autor} opciones={opcionesAutor} onCambiar={setAutor} />
                            </section>
                        </Col>
                        <Col lg={9}>
                            {mangasFiltrados.length === 0 ? (
                                <MensajeVacio
                                    titulo="No encontramos mangas"
                                    mensaje="Prueba cambiando o quitando alguno de los filtros."
                                />
                            ) : (
                                <Row xs={1} sm={2} xl={3} className="g-3">
                                    {mangasFiltrados.map((manga) => (
                                        <Col key={manga.id}>
                                            <TarjetaManga
                                                manga={manga}
                                                onAnadirCarrito={manejarAnadirCarrito}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
}

export default Catalogo;