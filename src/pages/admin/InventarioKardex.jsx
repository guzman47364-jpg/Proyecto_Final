import { useEffect, useState } from 'react';
import axios from 'axios';

const InventarioKardex = () => {
    const [movimientos, setMovimientos] = useState([]);

    useEffect(() => {
        // Aquí llamarías a tu API de Laravel
        const fetchMovimientos = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/inventarios', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMovimientos(res.data);
            } catch (error) {
                console.error("Error cargando el Kardex", error);
            }
        };
        fetchMovimientos();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Inventario (Kardex)</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <th className="p-4 border-b">Fecha</th>
                            <th className="p-4 border-b">Producto</th>
                            <th className="p-4 border-b">Tipo</th>
                            <th className="p-4 border-b">Cantidad</th>
                            <th className="p-4 border-b">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimientos.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 border-b text-sm">{new Date(m.created_at).toLocaleDateString()}</td>
                                <td className="p-4 border-b font-medium">{m.producto?.nombre}</td>
                                <td className="p-4 border-b">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${m.tipo === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {m.tipo.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 border-b font-bold">{m.cantidad}</td>
                                <td className="p-4 border-b text-sm text-gray-500">{m.descripcion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventarioKardex;