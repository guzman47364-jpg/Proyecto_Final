import { useEffect, useState } from 'react';
import api from "../../api/axios";
import Swal from 'sweetalert2';
import '../../styles/Proveedores.css'; 

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    // Estado inicial con 'estado' en true
    const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', estado: true });
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
                Swal.fire({ title: '¡Actualizado!', icon: 'success', confirmButtonColor: '#14b8a6' });
                setEditId(null);
            } else {
                await api.post('/proveedores', form);
                Swal.fire({ title: '¡Registrado!', icon: 'success', confirmButtonColor: '#14b8a6' });
            }
            setForm({ nombre: '', telefono: '', direccion: '', estado: true });
            loadData();
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'Revisa los datos del formulario', icon: 'error' });
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar proveedor?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, borrar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/proveedores/${id}`);
                loadData();
                Swal.fire('Eliminado', '', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar', 'error');
            }
        }
    };

    return (
        <div className="admin-container p-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">
                    {editId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                </h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">Nombre de Empresa</label>
                        <input className="input-field-pro" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">Teléfono</label>
                        <input className="input-field-pro" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-gray-400">Dirección Completa</label>
                        <input className="input-field-pro" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} />
                    </div>

                    {/* SWITCH DE ESTADO */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl w-fit">
                        <span className="text-xs font-black uppercase text-gray-500">Estado:</span>
                        <button 
                            type="button"
                            onClick={() => setForm({...form, estado: !form.estado})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${form.estado ? 'bg-teal-500' : 'bg-gray-300'}`}
                        >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${form.estado ? 'translate-x-6' : ''}`}></div>
                        </button>
                        <span className={`text-[10px] font-bold ${form.estado ? 'text-teal-600' : 'text-gray-400'}`}>
                            {form.estado ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <button type="submit" className="bg-slate-900 text-white font-black py-4 px-10 rounded-xl hover:bg-teal-500 transition-all uppercase text-xs tracking-widest">
                            {editId ? 'Guardar Cambios' : 'Registrar Proveedor'}
                        </button>
                        {editId && (
                            <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', telefono: '', direccion: '', estado: true }); }} className="text-gray-400 font-bold text-xs uppercase hover:text-red-500">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400">Proveedor</th>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400">Dirección</th>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-center">Estado</th>
                            <th className="p-6 text-[10px] font-black uppercase text-gray-400 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map(p => (
                            <tr key={p.id} className="border-b border-gray-50 last:border-0">
                                <td className="p-6">
                                    <div className="font-bold text-slate-800">{p.nombre}</div>
                                    <div className="text-xs text-gray-400">{p.telefono || 'Sin teléfono'}</div>
                                </td>
                                <td className="p-6 text-sm text-gray-500">{p.direccion || '—'}</td>
                                <td className="p-6 text-center">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${p.estado ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-500'}`}>
                                        {p.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-6 text-center">
                                    <button className="text-teal-500 hover:scale-125 transition-transform mr-4" onClick={() => { setEditId(p.id); setForm({ ...p, estado: p.estado === 1 || p.estado === true }); }}>✏️</button>
                                    <button className="text-red-400 hover:scale-125 transition-transform" onClick={() => handleDelete(p.id)}>🗑️</button>
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