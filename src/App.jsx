import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import AdminLayout from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/auth/Login';

// --- CAMBIO CLAVE: Renombramos los imports para que no choquen ---
import ProductosShop from './pages/shop/Productos'; 
import ProductosAdmin from './pages/admin/Productos';

import Usuarios from './pages/admin/Usuarios';
import Proveedores from './pages/admin/Proveedores';
import Categorias from './pages/admin/Categorias';
import Marcas from './pages/admin/Marcas';
import InventarioKardex from './pages/admin/InventarioKardex';
import Ventas from './pages/admin/Ventas';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* --- RUTA DE LA TIENDA (PÚBLICA) --- */}
      <Route path="/shop" element={<><Navbar /><ProductosShop /></>} />
      
      <Route path="/login" element={<><Navbar /><Login /></>} />

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
        
        {/* Aquí usas el de ADMIN */}
        <Route path="productos" element={<ProductosAdmin />} />
        
        {/* Ojo: tenías 'inventario' repetido, dejemos uno para el Kardex */}
        <Route path="inventario" element={<InventarioKardex />} />
        
        <Route path="ventas" element={<Ventas />} />
      </Route>

      <Route path="/" element={<Navigate to="/shop" />} />
      <Route path="*" element={<div className="p-20 text-center font-bold text-gray-400">404 - No encontrado</div>} />
    </Routes>
  );
}

export default App;