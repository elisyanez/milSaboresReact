import './App.css';
import Navbar from './components/navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Carrito from './pages/Carrito';
import Nosotros from './pages/Nosotros';
import Blogs from './pages/Blogs';
import Contacto from './pages/Contacto';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </>

  );
}

export default App;
