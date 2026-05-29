import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import AdminLayout from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register'; // <--- 1. IMPORTAMOS EL REGISTRO

// --- CAMBIO CLAVE: Renombramos los imports para que no choquen ---
import ProductosShop from './pages/shop/Productos'; 
import ProductosAdmin from './pages/admin/Productos';

import Usuarios from './pages/admin/Usuarios';
import Proveedores from './pages/admin/Proveedores';
import Categorias from './pages/admin/Categorias';
import Marcas from './pages/admin/Marcas';
import InventarioKardex from './pages/admin/InventarioKardex';
import Ventas from './pages/admin/Ventas';
import ShopLayout from './layouts/ShopLayout';
import CategoriasShop from './pages/shop/Categorias';
import OfertasShop from './pages/shop/Ofertas';
import CategoriaDetalle from './pages/shop/CategoriaDetalle';
import Catalogo from './pages/shop/Catalogo';
import Carrito from './pages/shop/Carrito';
function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* --- RUTAS DE LA TIENDA (LAYOUT PÚBLICO) --- */}
      <Route path="/" element={<ShopLayout />}>
        <Route index element={<Navigate to="/shop" />} />
        
        <Route path="shop" element={<ProductosShop />} />
        <Route path="categorias" element={<CategoriasShop />} />
        <Route path="ofertas" element={<OfertasShop />} />
        <Route path="login" element={<Login />} />
        
        {/* --- 2. RUTA DE REGISTRO PARA CLIENTES --- */}
        <Route path="registro" element={<Register />} /> 
        
        <Route path="categorias/:id" element={<CategoriaDetalle />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="carrito" element={<Carrito />} />
      </Route>

      {/* --- RUTAS DE ADMINISTRACIÓN (PROTEGIDAS) --- */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="marcas" element={<Marcas />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="inventario" element={<InventarioKardex />} />
        <Route path="ventas" element={<Ventas />} />
      </Route>

      <Route path="*" element={<div className="p-20 text-center font-bold text-gray-400">404 - No encontrado</div>} />
    </Routes>
  );
}

export default App;