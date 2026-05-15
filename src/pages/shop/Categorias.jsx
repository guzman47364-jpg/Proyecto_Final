import { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../styles/ShopPages.css'; 
import { Link } from 'react-router-dom';

const CategoriasShop = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await api.get('/categorias');
                setCategorias(res.data);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
            }
        };
        fetchCategorias();
    }, []);

    return (
        <div className="shop-wrapper pt-10 px-6">
            <header className="mb-16 text-center">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">
                    Explora nuestra <span className="text-teal-500">Colección</span>
                </h2>
                <div className="w-20 h-1.5 bg-teal-500 mx-auto mt-4 rounded-full"></div>
            </header>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-20">
                {categorias.map(cat => (
                    <Link 
                        key={cat.id} 
                        to={`/categorias/${cat.id}`} 
                        className="relative group h-[450px] rounded-[3rem] overflow-hidden shadow-2xl transition-all hover:scale-[1.02]"
                    >
                        {/* Imagen de fondo */}
                        {cat.imagen ? (
                            <img 
                                src={`http://localhost:8000/storage/${cat.imagen}`} 
                                alt={cat.nombre} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-5xl">📂</div>
                        )}

                        {/* Capa oscura (Overlay) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10">
                            <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter leading-none mb-2">
                                {cat.nombre}
                            </h3>
                            <p className="text-teal-400 text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                Ver Colección →
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoriasShop;