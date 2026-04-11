import { useState } from 'react';
import Marcas from './components/Marcas';
import Productos from './components/Productos';
import Categorias from './components/Categorias';
import Proveedores from './components/Proveedores';

function App() {
  const [vista, setVista] = useState('productos');

  return (
    <div className="app-container">
      {/* Navbar Corregido con Proveedores */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo-section">
            <div className="logo-box">P</div>
            <h1 className="logo-text">Control<span>Stock</span></h1>
          </div>

          <div className="nav-links">
            <button 
              onClick={() => setVista('productos')} 
              className={vista === 'productos' ? 'nav-btn active' : 'nav-btn'}
            >
              Productos
            </button>
            <button 
              onClick={() => setVista('marcas')} 
              className={vista === 'marcas' ? 'nav-btn active' : 'nav-btn'}
            >
              Marcas
            </button>
            <button 
              onClick={() => setVista('categorias')} 
              className={vista === 'categorias' ? 'nav-btn active' : 'nav-btn'}
            >
              Categorías
            </button>
            {/* NUEVO BOTÓN PARA PROVEEDORES */}
            <button 
              onClick={() => setVista('proveedores')} 
              className={vista === 'proveedores' ? 'nav-btn active' : 'nav-btn'}
            >
              Proveedores
            </button>
          </div>
        </div>
      </nav>

      {/* Main ajustado con la nueva vista */}
      <main className="main-content">
        <div className="card-container">
           {vista === 'productos' && <Productos />}
           {vista === 'marcas' && <Marcas />}
           {vista === 'categorias' && <Categorias />}
           {/* NUEVA VISTA PARA PROVEEDORES */}
           {vista === 'proveedores' && <Proveedores />}
        </div>
      </main>
    </div>
  );
}

export default App;