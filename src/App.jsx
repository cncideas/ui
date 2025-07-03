import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Tienda from './Components/Tienda';
import Blog from './Components/Blog';
import VideoDetail from './Components/VideoDetail';
import ProductoDetalle from './Pages/ProductoDetalle';
import Carrito from './Pages/Carrito';
import NotFound from './Pages/NotFound';
import Checkout from './Pages/Checkout';
import Contacto from './Pages/Contacto';
import Dashboard from './Pages/Admin/Dashboard';
import Planos from './Components/Planos';
import PlanoDetalle from './Pages/PlanoDetalle';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/contactenos" element={<Contacto />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/video/:slug" element={<VideoDetail />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
         <Route path="/carrito" element={<Carrito />} />
         <Route path="/checkout" element={<Checkout />} />
         <Route path="/admin" element={<Dashboard />} />
         <Route path="/planos" element={<Planos />} />
         <Route path="/plano/:id" element={<PlanoDetalle />} />

         <Route path="/*" element={<NotFound />} />


        {/* Agrega aquí más rutas cuando tengas más páginas */}
      </Routes>
    </Router>
        
    </>
  )
}

export default App
