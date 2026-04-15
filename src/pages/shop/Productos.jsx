import { useContext } from 'react'; // Añade esto
import { CartContext } from '../../context/CartContext';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../styles/Productos.css'; // <--- Usando Productos.css
import { AuthContext } from '../../context/AuthContext';

const Productos = () => {
    const [listaProductos, setListaProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [formProducto, setFormProducto] = useState({
        nombre: '', precio: '', stock: '', categoria_id: '', marca_id: ''
    });
    const [editingId, setEditingId] = useState(null);
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext); 
    useEffect(() => {
        // Esta función carga todo al mismo tiempo al entrar a la página
        const fetchTodo = async () => {
            try {
                const [resProd, resCat, resMar] = await Promise.all([
                    api.get('/productos'),
                    api.get('/categorias'),
                    api.get('/marcas')
                ]);
                setListaProductos(resProd.data);
                setCategorias(resCat.data);
                setMarcas(resMar.data);
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        };
        fetchTodo();
    }, []);

  return (
        <div className="bg-gray-50 min-h-screen">
            {/* Sección de Bienvenida */}
            <header className="hero-tienda">
                <h1 className="titulo-hero">
                    Lo mejor en <span className="text-teal-500">Moda</span>
                </h1>
                <p className="subtitulo-hero">
                    Equípate con las mejores marcas y la última moda del mercado
                </p>
            </header>

            {/* Cuadrícula de Productos */}
            <main className="productos-grid">
                {listaProductos.map((item) => (
                    <div key={item.id} className="producto-card">
                        <div className="producto-img-placeholder"> 📦 </div>
                        
                        <div className="producto-info">
                            {/* ... (Categoría, Stock, Nombre, Precio) ... */}

                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-2xl font-black text-gray-900">${item.precio}</span>
                                <button 
                                    onClick={() => addToCart(item)} 
                                    className="btn-compra flex items-center gap-2"
                                >
                                    Añadir 🛒
                                </button>
                            </div>

                            {/* --- AQUÍ VA EL BLOQUE DE ADMIN --- */}
                            {(user?.rol === 'Admin' || user?.rol === 'Vendedor') && (
                                <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 justify-center">
                                    <button 
                                        onClick={() => handleEdit(item)} 
                                        className="text-blue-500 font-bold text-xs hover:underline flex items-center gap-1"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)} 
                                        className="text-red-500 font-bold text-xs hover:underline flex items-center gap-1"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            )}
                            {/* ---------------------------------- */}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default Productos;