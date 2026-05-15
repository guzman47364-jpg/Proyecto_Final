import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { CartContext } from '../../context/CartContext';
import '../../styles/Productos.css'; 

const CategoriaDetalle = () => {
    const { id } = useParams(); 
    const [productos, setProductos] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // 1. Obtenemos todos los productos y filtramos por la categoría seleccionada
                const resProd = await api.get('/productos');
                const filtrados = resProd.data.filter(p => p.categoria_id == id);
                setProductos(filtrados);

                // 2. Buscamos el nombre de la categoría para el título de la página
                const resCat = await api.get('/categorias');
                const catInfo = resCat.data.find(c => c.id == id);
                setCategoria(catInfo);

            } catch (err) {
                console.error("Error cargando categoría:", err);
            }
        };
        fetchDatos();
    }, [id]);

    return (
        <div className="shop-wrapper pt-10">
            <header className="mb-16 text-center">
                <h2 className="text-5xl font-black uppercase tracking-tighter">
                    {categoria?.nombre || 'Colección'} <span className="text-teal-500">Seleccionada</span>
                </h2>
                <div className="w-24 h-1.5 bg-teal-500 mx-auto mt-4 rounded-full"></div>
            </header>

            <main className="productos-section">
                {productos.length > 0 ? (
                    <div className="productos-grid">
                        {productos.map((item) => (
                            <div key={item.id} className="producto-card-pro">
                                <div className="producto-img-container-pro">
                                    {item.imagen ? (
                                        <img 
                                            src={`http://localhost:8000/storage/${item.imagen}`} 
                                            className="producto-img-foto" 
                                            alt={item.nombre} 
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-4xl bg-gray-100">📦</div>
                                    )}
                                </div>
                                <div className="producto-info-pro flex-grow flex flex-col">
                                    <h3 className="producto-nombre-pro text-2xl mb-4">{item.nombre}</h3>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="producto-precio-pro text-3xl">${item.precio}</span>
                                        <button onClick={() => addToCart(item)} className="btn-compra-pro">
                                            Añadir 🛒
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200 mx-6">
                        <span className="text-6xl block mb-4">🔍</span>
                        <p className="text-xl font-bold text-gray-400">Aún no hay productos en esta categoría.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

// ESTA LÍNEA ES LA QUE CORRIGE TU ERROR:
export default CategoriaDetalle;