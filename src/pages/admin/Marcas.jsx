import { useEffect, useState } from 'react';
import api from "../../api/axios";

const Marcas = () => {
    const [marcas, setMarcas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);

    const loadData = async () => {
        try {
            const res = await api.get('/marcas');
            setMarcas(res.data);
        } catch (error) {
            console.error("Error cargando marcas:", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/marcas/${editId}`, { nombre });
                setEditId(null);
            } else {
                await api.post('/marcas', { nombre });
            }
            setNombre('');
            loadData();
            alert("Marca guardada");
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Error al procesar"));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Marcas</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input 
                    placeholder="Nombre de la marca" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required 
                />
                <button type="submit" style={{ marginLeft: '10px' }}>
                    {editId ? 'Actualizar' : 'Guardar'}
                </button>
            </form>

            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {marcas.map(m => (
                        <tr key={m.id}>
                            <td style={{ textAlign: 'center' }}>{m.id}</td>
                            <td>{m.nombre}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button onClick={() => { setEditId(m.id); setNombre(m.nombre); }}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Marcas;