import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import AdminLayout from './layouts/AdminLayout'; // Importamos el Layout
import { ProtectedRoute } from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Productos from './pages/shop/Productos';
import Usuarios from './pages/admin/Usuarios';
import Proveedores from './pages/admin/Proveedores';
import Categorias from './pages/admin/Categorias';
import Marcas from './pages/admin/Marcas';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* --- RUTA DE LA TIENDA (Con Navbar) --- */}
      <Route path="/shop" element={<><Navbar /><Productos /></>} />
      
      {/* --- RUTA DE LOGIN (Sin Navbar o con Navbar, tú eliges) --- */}
      // App.jsx
    <Route path="/login" element={<><Navbar /><Login /></>} />

      {/* --- RUTAS DE ADMINISTRACIÓN (Con Sidebar y Protegidas) --- */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        {/* Rutas Hijas que se verán dentro del AdminLayout */}
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="marcas" element={<Marcas />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="inventario" element={<Productos />} />
      </Route>

      {/* --- REDIRECCIÓN Y ERRORES --- */}
      <Route path="/" element={<Navigate to="/shop" />} />
      <Route path="*" element={<div className="p-20 text-center font-bold text-gray-400">404 - No encontrado</div>} />
    </Routes>
  );
}

export default App;