import { useEffect, useState } from 'react';
import api from '../api/axios';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);

    const fetchCategorias = async () => {
        const res = await api.get('/categorias');
        setCategorias(res.data);
    };

    useEffect(() => { fetchCategorias(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await api.put(`/categorias/${editId}`, { nombre });
            setEditId(null);
        } else {
            await api.post('/categorias', { nombre });
        }
        setNombre('');
        fetchCategorias();
    };

    const deleteCategoria = async (id) => {
        if (confirm('¿Eliminar categoría?')) {
            await api.delete(`/categorias/${id}`);
            fetchCategorias();
        }
    };

    return (
        <div className="section-container fade-in">
            <div className="section-header">
                <h2>Gestión de Categorías</h2>
                <p>Organiza tus productos por tipo o grupo.</p>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group span-2">
                    <label>Nombre de la Categoría</label>
                    <input 
                        value={nombre} 
                        onChange={e => setNombre(e.target.value)} 
                        placeholder="Ej: Electrónica, Repuestos..." 
                        required 
                    />
                </div>
                <div className="form-group form-button">
                    <button type="submit">
                        {editId ? 'Actualizar' : 'Guardar Categoría'}
                    </button>
                </div>
            </form>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className="th-center" style={{width: '10%'}}>ID</th>
                            <th className="th-main">NOMBRE DE CATEGORÍA</th>
                            <th className="th-actions">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map(c => (
                            <tr key={c.id}>
                                <td className="td-center font-mono">#{c.id}</td>
                                <td className="td-main p-nombre">{c.nombre}</td>
                                <td className="td-actions">
                                    <button onClick={() => { setEditId(c.id); setNombre(c.nombre); }} className="btn-edit">Editar</button>
                                    <button onClick={() => deleteCategoria(c.id)} className="btn-delete">Borrar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categorias;