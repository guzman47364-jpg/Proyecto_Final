import { useEffect, useState } from 'react';
import api from "../../api/axios";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);

    const loadData = async () => {
        try {
            const res = await api.get('/categorias');
            setCategorias(res.data);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/categorias/${editId}`, { nombre });
                setEditId(null);
            } else {
                await api.post('/categorias', { nombre });
            }
            setNombre('');
            loadData();
            alert("Categoría guardada");
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Error al procesar"));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Categorías</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input 
                    placeholder="Nombre de la categoría" 
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
                    {categorias.map(c => (
                        <tr key={c.id}>
                            <td style={{ textAlign: 'center' }}>{c.id}</td>
                            <td>{c.nombre}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button onClick={() => { setEditId(c.id); setNombre(c.nombre); }}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Categorias;