import { useEffect, useState } from 'react';
import api from '../api/axios';

const Marcas = () => {
    const [marcas, setMarcas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchMarcas = async () => {
        const res = await api.get('/marcas');
        setMarcas(res.data);
    };

    useEffect(() => { fetchMarcas(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/marcas/${editId}`, { nombre });
            setEditId(null);
        } else {
            await api.post('/marcas', { nombre });
        }
        setNombre('');
        fetchMarcas();
    };

    const deleteMarca = async (id) => {
        if (confirm('¿Eliminar marca?')) {
            await api.delete(`/marcas/${id}`);
            fetchMarcas();
        }
    };

    return (
        <div className="section-container fade-in">
            <div className="section-header">
                <h2>Catálogo de Marcas</h2>
                <p>Administra los fabricantes de tus productos.</p>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group span-2">
                    <label>Nombre de la Marca</label>
                    <input 
                        value={nombre} 
                        onChange={e => setNombre(e.target.value)} 
                        placeholder="Ej: Toyota, Samsung..." 
                        required 
                    />
                </div>
                <div className="form-group form-button">
                    <button type="submit">
                        {editId ? 'Actualizar' : 'Guardar Marca'}
                    </button>
                </div>
            </form>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className="th-center" style={{width: '10%'}}>ID</th>
                            <th className="th-main">NOMBRE DE MARCA</th>
                            <th className="th-actions">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcas.map(m => (
                            <tr key={m.id}>
                                <td className="td-center font-mono">#{m.id}</td>
                                <td className="td-main p-nombre">{m.nombre}</td>
                                <td className="td-actions">
                                    <button onClick={() => { setEditId(m.id); setNombre(m.nombre); }} className="btn-edit">Editar</button>
                                    <button onClick={() => deleteMarca(m.id)} className="btn-delete">Borrar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Marcas;