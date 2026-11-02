import '../css/estilos.css'
import '../css/menu.css'
import '../css/index.css'

function Pie() {
    return (
        <footer>
            <div className="contenedor-footer">
                <div className="footer-superior">
                    <img src="img/Logo.png" alt="Logo MangaVerse" className="logo-footer" />
                    <ul className="footer-nav">
                        <li><a href="/">Inicio</a></li>
                        <li><a href="/catalogo">Catalogo</a></li>
                        <li><a href="/blog">Blog</a></li>
                        <li><a href="/quienes-somos">Quienes somos</a></li>
                        <li><a href="/login">Mi cuenta</a></li>
                        <li><a href="/contacto">Contacto</a></li>
                    </ul>
                </div>
            </div>

            <hr className="linea-div-footer" />

            <div className="footer-inferior">
                <p>© 2026 MangaVerse. Todos los derechos reservados.</p>
                <p className="frase-footer">Acercando la pasión del manga a todo Santiago</p>
            </div>
        </footer>
    )
}

export default Pie