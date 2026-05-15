import { useEffect, useState } from 'react';
import api from '../../api/axios';
import '../../styles/ShopPages.css'; 

const OfertasShop = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        api.get('/productos').then(res => {
            // Filtro temporal: productos con precio menor a $50 o stock alto
            const filtrados = res.data.filter(p => p.precio < 50);
            setProductos(filtrados);
        });
    }, []);

    return (
        <div className="shop-container">
            <header className="mb-12">
                <h2 className="text-4xl font-black text-slate-900">
                    🔥 Zona de <span className="text-orange-500">Ofertas</span>
                </h2>
                <p className="text-slate-400 font-medium mt-2">Aprovecha antes de que se agoten.</p>
            </header>

            <div className="productos-grid">
                {productos.map(item => (
                    <div key={item.id} className="producto-card">
                        {/* Reutiliza aquí el contenido de tu tarjeta de ProductosShop */}
                        <div className="producto-info">
                            <h3 className="producto-nombre">{item.nombre}</h3>
                            <span className="text-2xl font-black">${item.precio}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfertasShop;