import { useEffect, useState } from 'react';
import api from "../../api/axios";

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
            alert("¡Proveedor guardado!");
        } catch (error) {
            alert("Error al guardar: " + (error.response?.data?.message || "Revisa los datos"));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestión de Proveedores</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
                <button type="submit">{editId ? 'Actualizar' : 'Guardar'}</button>
            </form>

            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
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
                                <button onClick={() => { setEditId(p.id); setForm(p); }}>Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Proveedores;