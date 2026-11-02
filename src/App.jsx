//import './App.css'
import { useEffect } from 'react'
import Cabecera from './componentes/Cabecera'
import Banner from './componentes/Banner'
import Pie from './componentes/Pie'
import ToastCarrito from './componentes/ToastCarrito'
import RutaPrivada from './componentes/RutaPrivada'
import { inicializarAdministrador } from './data/almacenamiento'

import Home from './pages/Home'
import Contacto from './pages/Contacto'
import AdminClientes from './pages/Admin-clientes'
import AdminDscto from './pages/admin-dscto'
import AdminPedidos from './pages/admin-pedidos'
import AdminProductos from './pages/Admin-productos'
import AdminDashboard from './pages/admin-dashboard'
import Carrito from './pages/Carrito'
import Catalogo from './pages/Catalogo'
import CompraExitosa from './pages/Compra-exitosa'
import Login from './pages/Login'
import MiCuentaContraseña from './pages/Mi-cuenta-contraseña'
import MiCuentaPedidos from './pages/Mi-cuenta-pedidos'
import MiCuenta from './pages/Mi-cuenta'
import QuienesSomos from './pages/Quienes-somos'
import Registro from './pages/Registro'
import Blog from './pages/Blog'

import { Routes, Route } from 'react-router-dom'

function App() {
  useEffect(() => {
    inicializarAdministrador()
  }, [])

  return (
    <>
    <Banner></Banner>
    <Cabecera></Cabecera>
    <ToastCarrito />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/admin-clientes" element={<RutaPrivada rol="admin"><AdminClientes /></RutaPrivada>} />
      <Route path="/admin-dscto" element={<RutaPrivada rol="admin"><AdminDscto /></RutaPrivada>} />
      <Route path="/admin-pedidos" element={<RutaPrivada rol="admin"><AdminPedidos /></RutaPrivada>} />
      <Route path="/admin-productos" element={<RutaPrivada rol="admin"><AdminProductos /></RutaPrivada>} />
      <Route path="/admin-dashboard" element={<RutaPrivada rol="admin"><AdminDashboard /></RutaPrivada>} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/compra-exitosa" element={<CompraExitosa />} />
      <Route path="/login" element={<Login />} />
      <Route path="/mi-cuenta-contraseña" element={<RutaPrivada><MiCuentaContraseña /></RutaPrivada>} />
      <Route path="/mi-cuenta-pedidos" element={<RutaPrivada><MiCuentaPedidos /></RutaPrivada>} />
      <Route path="/mi-cuenta" element={<RutaPrivada><MiCuenta /></RutaPrivada>} />
      <Route path="/quienes-somos" element={<QuienesSomos />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
    <Pie></Pie>
    </>
  )
}

export default App
