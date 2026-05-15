import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
    // 1. Obtenemos la ruta actual
    const location = useLocation();

    // 2. Función para verificar si una ruta está activa
    // Esto nos ahorra repetir código en cada link
    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Lateral */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-8">
                    <h2 className="text-2xl font-black tracking-tighter text-teal-400">
                        ADMIN<span className="text-white">STORE</span>
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 flex flex-col">
                    
                    {/* USUARIOS */}
                    <Link 
                        to="/admin/usuarios" 
                        className={`block p-3 !text-white rounded-xl font-bold text-sm transition-all ${
                            isActive('/admin/usuarios') 
                            ? 'bg-gray-800 border-l-4 border-teal-400 rounded-l-none' 
                            : 'hover:bg-gray-800'
                        }`}
                    >
                        👤 Usuarios
                    </Link>

                    {/* PRODUCTOS */}
                    <Link 
                        to="/admin/productos" 
                        className={`block p-3 !text-white rounded-xl font-bold text-sm transition-all ${
                            isActive('/admin/productos') 
                            ? 'bg-gray-800 border-l-4 border-teal-400 rounded-l-none' 
                            : 'hover:bg-gray-800'
                        }`}
                    >
                        📦 Productos
                    </Link>
                    
                    {/* CATEGORÍAS */}
                    <Link 
                        to="/admin/categorias" 
                        className={`block p-3 !text-white rounded-xl font-bold text-sm transition-all ${
                            isActive('/admin/categorias') 
                            ? 'bg-gray-800 border-l-4 border-teal-400 rounded-l-none' 
                            : 'hover:bg-gray-800'
                        }`}
                    >
                        📂 Categorías
                    </Link>
                    
                    {/* MARCAS */}
                    <Link 
                        to="/admin/marcas" 
                        className={`block p-3 !text-white rounded-xl font-bold text-sm transition-all ${
                            isActive('/admin/marcas') 
                            ? 'bg-gray-800 border-l-4 border-teal-400 rounded-l-none' 
                            : 'hover:bg-gray-800'
                        }`}
                    >
                        🏷️ Marcas
                    </Link>

                    {/* PROVEEDORES */}
                    <Link 
                        to="/admin/proveedores" 
                        className={`block p-3 !text-white rounded-xl font-bold text-sm transition-all ${
                            isActive('/admin/proveedores') 
                            ? 'bg-gray-800 border-l-4 border-teal-400 rounded-l-none' 
                            : 'hover:bg-gray-800'
                        }`}
                    >
                        🚚 Proveedores
                    </Link>
                    
                    <hr className="my-4 border-gray-700" />
                    
                    {/* KARDEX */}
                    <Link 
                        to="/admin/inventario" 
                        className={`block p-3 rounded-xl font-bold text-sm transition-all ${
                            isActive('/admin/inventario') 
                            ? 'bg-gray-800 border-l-4 border-teal-400 text-teal-400' 
                            : '!text-teal-400 hover:bg-gray-800'
                        }`}
                    >
                        📊 Kardex (Inventario)
                    </Link>

                    <div className="mt-auto pt-8 pb-4">
                        <Link to="/shop" className="block p-3 !text-white bg-teal-600 hover:bg-teal-500 rounded-xl font-bold text-sm text-center shadow-lg shadow-teal-500/30 transition-all">
                            ⬅ Volver a Tienda
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Contenido a la derecha del Sidebar */}
            <main className="flex-1 ml-64 p-10">
                <Outlet /> 
            </main>
        </div>
    );
};

export default AdminLayout;