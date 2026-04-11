import { useEffect, useState } from 'react';
import api from '../api/axios'; // La ruta que ya te funciona

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({ nombre: '', contacto: '' });
    const [editId, setEditId] = useState(null);

    const loadData = async () => {
        try {
            const res = await api.get('/proveedores');
            setProveedores(res.data);
        } catch (error) {
            console.error("Error cargando proveedores", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/proveedores/${editId}`, form);
                setEditId(null);
            } else {
                await api.post('/proveedores', form);
            }
            setForm({ nombre: '', contacto: '' });
            loadData();
            alert("Proveedor guardado");
        } catch (error) {
            alert("Error al guardar: " + (error.response?.data?.message || "Revisa los campos"));
        }
    };

    const deleteProveedor = async (id) => {
        if (window.confirm('¿Eliminar este proveedor?')) {
            await api.delete(`/proveedores/${id}`);
            loadData();
        }
    };

    return (
        <div className="section-container fade-in">
            <h2>Gestión de Proveedores</h2>
            
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label>Nombre del Proveedor</label>
                    <input 
                        value={form.nombre} 
                        onChange={e => setForm({...form, nombre: e.target.value})} 
                        placeholder="Ej: Distribuidora Central" 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Contacto (Opcional)</label>
                    <input 
                        value={form.contacto} 
                        onChange={e => setForm({...form, contacto: e.target.value})} 
                        placeholder="Teléfono o Email" 
                    />
                </div>
                <div className="form-group form-button">
                    <button type="submit">{editId ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>NOMBRE</th>
                            <th>CONTACTO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map(p => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.contacto || 'Sin contacto'}</td>
                                <td>
                                    <button onClick={() => { setEditId(p.id); setForm(p); }} className="btn-edit">Editar</button>
                                    <button onClick={() => deleteProveedor(p.id)} className="btn-delete">Borrar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Proveedores;