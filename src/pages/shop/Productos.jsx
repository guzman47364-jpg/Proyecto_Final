import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import '../../styles/Productos.css'; 

const Productos = () => {
    const [listaProductos, setListaProductos] = useState([]);
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const resProd = await api.get('/productos');
                setListaProductos(resProd.data);
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        };
        fetchTodo();
    }, []);

    // Limitamos a los 6 más recientes (2 filas de 3)
    const productosRecientes = listaProductos.slice(0, 6);

    return (
        <div className="shop-wrapper">
            
            {/* --- HERO --- */}
            <header className="hero-moderno-moda">
                <div className="hero-content-moda">
                    <span className="hero-tag-moda">Colección Primavera 2026</span>
                    <h1 className="hero-title-moda">
                        ESTILO <span className="text-teal-500">SIN LÍMITES</span>
                    </h1>
                    <p className="hero-subtitle-moda">
                        Descubre las últimas tendencias con materiales premium y diseños exclusivos.
                    </p>
                    <button 
                        onClick={() => navigate('/catalogo')} 
                        className="btn-hero-moda"
                    >
                        Ver Catálogo
                    </button>
                </div>
            </header>

            {/* --- PROMO GRID (Con Imágenes) --- */}
            <section className="promo-grid-container">
                <div 
                    className="promo-main-moda"
                    style={{ 
                        backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80')" 
                    }}
                >
                    <div className="promo-info-moda">
                        <h2 className="promo-title-moda italic">WOMAN SELECTION</h2>
                        <p className="promo-text-moda">HASTA 30% OFF EN VESTIDOS</p>
                    </div>
                </div>

                <div className="promo-side-stack">
                    <div 
                        className="promo-side-item-moda"
                        style={{ 
                            backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" 
                        }}
                    >
                        <span className="promo-side-text-moda">NUEVOS ACCESORIOS</span>
                    </div>

                    <div 
                        className="promo-side-item-moda"
                        style={{ 
                            backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80')" 
                        }}
                    >
                        <span className="promo-side-text-moda">CALZADO PRO</span>
                    </div>
                </div>
            </section>

            {/* --- LISTADO RECIENTES --- */}
            <main className="productos-section">
                <div className="section-header-moda mb-10 text-center">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">
                        Lo más <span className="text-teal-500">Reciente</span>
                    </h2>
                    <div className="w-20 h-1.5 bg-teal-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="productos-grid">
                    {productosRecientes.map((item) => (
                        <div key={item.id} className="producto-card-pro">
                            <div className="producto-img-container-pro">
                                {item.imagen ? (
                                    <img 
                                        src={`http://localhost:8000/storage/${item.imagen}`} 
                                        className="producto-img-foto"
                                        alt={item.nombre}
                                    />
                                ) : (
                                    <div className="producto-img-placeholder">📦</div>
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

                <div className="text-center mt-16">
                    <button 
                        onClick={() => navigate('/catalogo')}
                        className="border-2 border-gray-900 text-gray-900 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all"
                    >
                        Ver todos los productos
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Productos;