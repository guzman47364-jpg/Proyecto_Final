import { useEffect, useState } from 'react';
import api from "../../api/axios";
import '../../styles/Proveedores.css'; 

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '' });
    const [editId, setEditId] = useState(null);

    const loadData = async () => {
        try {
            const res = await api.get('/proveedores');
            setProveedores(res.data);
        } catch (error) {
            console.error("Error cargando proveedores:", error);
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
            setForm({ nombre: '', telefono: '', direccion: '' });
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Deseas eliminar este proveedor?")) {
            try {
                await api.delete(`/proveedores/${id}`);
                loadData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="proveedores-container">
            <div className="form-card">
                <h2>Gestión de Proveedores</h2>
                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="input-field">
                        <label>Nombre</label>
                        <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                    </div>
                    <div className="input-field">
                        <label>Teléfono</label>
                        <input value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                    </div>
                    <div className="input-field">
                        <label>Dirección</label>
                        <input value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
                    </div>
                    <button type="submit" className="btn-save">
                        {editId ? 'Actualizar' : 'Guardar'}
                    </button>
                </form>
            </div>

            <div className="table-card">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map(p => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.telefono}</td>
                                <td>{p.direccion}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => { setEditId(p.id); setForm(p); }}>Editar</button>
                                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
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