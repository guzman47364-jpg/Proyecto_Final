import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import api from '../../api/axios';
import '../../styles/Productos.css'; 

const Catalogo = () => {
    const [listaProductos, setListaProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productosPorPagina = 15;
    
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [resProd, resCat] = await Promise.all([
                    api.get('/productos'),
                    api.get('/categorias')
                ]);
                setListaProductos(resProd.data);
                setCategorias(resCat.data);
            } catch (err) { console.error(err); }
        };
        fetchDatos();
    }, []);

    // 1. Filtrado por categoría
    const productosFiltrados = filtroCategoria 
        ? listaProductos.filter(p => p.categoria_id === filtroCategoria)
        : listaProductos;

    // 2. Lógica de Paginación (15 por página)
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const indiceFinal = currentPage * productosPorPagina;
    const indiceInicial = indiceFinal - productosPorPagina;
    const productosVisibles = productosFiltrados.slice(indiceInicial, indiceFinal);

    return (
        <div className="shop-wrapper pt-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 px-6">
                
                {/* --- SIDEBAR DE FILTROS --- */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-6 italic">Categorías</h3>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => { setFiltroCategoria(null); setCurrentPage(1); }}
                                className={`text-left text-sm ${!filtroCategoria ? 'text-teal-500 font-black' : 'text-gray-400 font-bold'}`}
                            >
                                TODOS LOS PRODUCTOS
                            </button>
                            {categorias.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => { setFiltroCategoria(cat.id); setCurrentPage(1); }}
                                    className={`text-left text-sm uppercase ${filtroCategoria === cat.id ? 'text-teal-500 font-black' : 'text-gray-400 font-bold'}`}
                                >
                                    {cat.nombre}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* --- CONTENIDO PRINCIPAL (3 POR FILA) --- */}
                <main className="flex-grow">
                    <header className="mb-10">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                            Catálogo <span className="text-teal-500">Completo</span>
                        </h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                            Mostrando {productosVisibles.length} de {productosFiltrados.length} prendas
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productosVisibles.map((item) => (
                            <div key={item.id} className="producto-card-pro">
                                <div className="producto-img-container-pro h-80">
                                    <img 
                                        src={`http://localhost:8000/storage/${item.imagen}`} 
                                        className="producto-img-foto" 
                                        alt={item.nombre} 
                                    />
                                </div>
                                <div className="producto-info-pro">
                                    <h3 className="producto-nombre-pro">{item.nombre}</h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="producto-precio-pro text-3xl">${item.precio}</span>
                                        <button 
                                            onClick={() => addToCart(item)} 
                                            className="btn-compra-pro"
                                        >
                                            Añadir 🛒
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- PAGINACIÓN --- */}
                    {totalPaginas > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-16 pb-10">
                            {[...Array(totalPaginas)].map((_, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-12 h-12 rounded-full font-black text-xs transition-all ${
                                        currentPage === i + 1 
                                        ? 'bg-gray-900 text-white' 
                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-teal-500'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Catalogo;