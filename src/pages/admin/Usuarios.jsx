import { useEffect, useState } from 'react';
import api from "../../api/axios";
import Swal from 'sweetalert2';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', password: '', rol: 'Vendedor' });
    const [loading, setLoading] = useState(false);
    const [paginacion, setPaginacion] = useState({});
    const [editingId, setEditingId] = useState(null); 

    const loadUsers = async (page = 1) => {
        try {
            const res = await api.get(`/admin/usuarios?page=${page}`);
            // Ajuste para leer la estructura de tu JSON { data: [...] }
            const userData = res.data.data || res.data;
            setUsuarios(userData);
            setPaginacion({
                currentPage: res.data.current_page || res.data.pagination?.currentPage || 1,
                lastPage: res.data.last_page || res.data.pagination?.lastPage || 1
            });
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleEdit = (u) => {
        setEditingId(u.id);
        setForm({
            name: u.name,
            email: u.email,
            password: '', 
            rol: typeof u.roles[0] === 'string' ? u.roles[0] : u.roles[0]?.name || 'Vendedor'
        });
        // Desplazar hacia arriba para ver el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/usuarios/${id}`);
                await loadUsers(); // <-- CORREGIDO: Antes decía fetchData()
                Swal.fire('¡Borrado!', 'El usuario ha sido eliminado.', 'success');
            } catch (error) {
                const mensajeError = error.response?.data?.message || "";
                
                // Manejo de error de llave foránea (Integridad referencial)
                if (mensajeError.includes("Foreign key violation") || error.response?.status === 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No se puede eliminar',
                        text: 'Este usuario tiene historial de ventas o productos asociados. Para mantener la integridad contable, no puede ser eliminado físicamente.',
                        confirmButtonColor: '#d33'
                    });
                } else {
                    Swal.fire('Error', 'No se pudo completar la acción', 'error');
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await api.put(`/admin/usuarios/${editingId}`, form);
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Usuario modificado con éxito',
                    icon: 'success',
                    confirmButtonColor: '#14b8a6',
                });
                setEditingId(null);
            } else {
                await api.post('/admin/usuarios', form);
                Swal.fire({
                    title: '¡Creado!',
                    text: 'Usuario registrado con éxito',
                    icon: 'success',
                    confirmButtonColor: '#14b8a6',
                });
            }
            
            setForm({ name: '', email: '', password: '', rol: 'Vendedor' });
            await loadUsers(); 
        } catch (error) {
             Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo guardar la información',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({ name: '', email: '', password: '', rol: 'Vendedor' });
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-black text-gray-800 mb-6 tracking-tighter text-center uppercase">Gestión de Usuarios</h2>
            
            <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-700">
                    {editingId ? `Editando Usuario: ${form.name}` : 'Registrar Nuevo Personal'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    <input className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    <input className="border p-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" type="password" placeholder={editingId ? "Nueva pass (opcional)" : "Contraseña"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editingId} />
                    <select className="border p-2 rounded-lg text-sm bg-gray-50 font-semibold cursor-pointer" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Admin">Admin</option>
                        <option value="Cliente">Cliente</option>
                    </select>
                    
                    <div className="flex gap-2">
                        <button type="submit" disabled={loading} className={`${editingId ? 'bg-orange-500' : 'bg-teal-500'} flex-1 text-white font-bold rounded-lg hover:opacity-80 transition-all disabled:opacity-50 h-10`}>
                            {loading ? '...' : (editingId ? 'GUARDAR' : 'CREAR')}
                        </button>
                        {editingId && (
                            <button onClick={cancelEdit} type="button" className="bg-gray-400 text-white px-2 rounded-lg hover:bg-gray-600 transition-colors">✕</button>
                        )}
                    </div>
                </div>
            </form>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Nombre</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase">Roles</th>
                            <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {usuarios.length > 0 ? usuarios.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-800">{u.name}</td>
                                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                <td className="px-6 py-4">
                                    {u.roles?.map((r, index) => (
                                        <span key={index} className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-[10px] font-black uppercase mr-1">
                                            {typeof r === 'string' ? r : r.name}
                                        </span>
                                    ))}
                                </td>
                                <td className="px-6 py-4 flex justify-center gap-3">
                                    <button onClick={() => handleEdit(u)} className="hover:scale-125 transition-transform" title="Editar">
                                        <span className="text-xl">✏️</span>
                                    </button>
                                    <button onClick={() => handleDelete(u.id)} className="hover:scale-125 transition-transform" title="Eliminar">
                                        <span className="text-xl">🗑️</span>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-gray-400">No se encontraron usuarios</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                <div className="p-4 bg-gray-50 flex justify-between items-center text-xs font-bold text-gray-500 border-t border-gray-100">
                    <span>Página {paginacion.currentPage} de {paginacion.lastPage}</span>
                    <div className="flex gap-2">
                        <button onClick={() => loadUsers(paginacion.currentPage - 1)} disabled={paginacion.currentPage === 1} className="px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-30 hover:bg-gray-100 transition-colors">Ant.</button>
                        <button onClick={() => loadUsers(paginacion.currentPage + 1)} disabled={paginacion.currentPage === paginacion.lastPage} className="px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-30 hover:bg-gray-100 transition-colors">Sig.</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Usuarios;