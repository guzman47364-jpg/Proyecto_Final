import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Lateral */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-8">
                    <h2 className="text-2xl font-black tracking-tighter text-teal-400">ADMIN<span className="text-white">STORE</span></h2>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    <Link to="/admin/usuarios" className="block p-3 hover:bg-gray-800 rounded-xl font-bold text-sm">👤 Usuarios</Link>
                    <Link to="/admin/categorias" className="block p-3 hover:bg-gray-800 rounded-xl font-bold text-sm">📂 Categorías</Link>
                    <Link to="/admin/marcas" className="block p-3 hover:bg-gray-800 rounded-xl font-bold text-sm">🏷️ Marcas</Link>
                    <Link to="/admin/proveedores" className="block p-3 hover:bg-gray-800 rounded-xl font-bold text-sm">🚚 Proveedores</Link>
                    <hr className="my-4 border-gray-800" />
                    <Link to="/shop" className="block p-3 text-teal-400 hover:bg-teal-900/30 rounded-xl font-bold text-sm">⬅ Volver a Tienda</Link>
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