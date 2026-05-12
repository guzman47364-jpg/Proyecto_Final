import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Lateral */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-8">
                    <h2 className="text-2xl font-black tracking-tighter text-teal-400">ADMIN<span className="text-white">STORE</span></h2>
                </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 flex flex-col">
            <Link to="/admin/usuarios" className="block p-3 !text-white hover:bg-gray-800 rounded-xl font-bold text-sm transition-colors">👤 Usuarios</Link>
            <Link to="/admin/productos" className="block p-3 !text-white hover:bg-gray-800 rounded-xl font-bold text-sm transition-colors">📦 Productos</Link>
            
            <Link to="/admin/categorias" className="block p-3 !text-white bg-gray-800 border-l-4 border-teal-400 rounded-r-xl font-bold text-sm">📂 Categorías</Link>
            
            <Link to="/admin/marcas" className="block p-3 !text-white hover:bg-gray-800 rounded-xl font-bold text-sm transition-colors">🏷️ Marcas</Link>
            <Link to="/admin/proveedores" className="block p-3 !text-white hover:bg-gray-800 rounded-xl font-bold text-sm transition-colors">🚚 Proveedores</Link>
            
            <hr className="my-4 border-gray-700" />
            
            <Link to="/admin/inventario" className="block p-3 !text-teal-400 hover:bg-gray-800 rounded-xl font-bold text-sm transition-colors">📊 Kardex (Inventario)</Link>

            <div className="mt-auto pt-8 pb-4">
                <Link to="/shop" className="block p-3 !text-white bg-teal-600 hover:bg-teal-500 rounded-xl font-bold text-sm text-center shadow-lg shadow-teal-500/30 transition-all">
                    ⬅ Volver a Tienda
                </Link>
            </div>
        </nav>
            </aside>

            {/* Contenido a la derecha del Sidebar */}
            <main className="flex-1 ml-64 p-10">
                {/* Aquí es donde se cargarán Usuarios.jsx, Categorias.jsx, etc. */}
                <Outlet /> 
            </main>
        </div>
    );
};

export default AdminLayout;