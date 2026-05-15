import { useEffect, useState } from 'react';
import api from "../../api/axios";
import Swal from 'sweetalert2';
// Asegúrate de tener este archivo o usa el de Categorias.css si son iguales
import '../../styles/Categorias.css'; 

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
                
                // --- ALERTA DE ÉXITO (EDICIÓN) ---
                Swal.fire({
                    title: '¡Marca Actualizada!',
                    text: 'Los cambios se guardaron correctamente',
                    icon: 'success',
                    confirmButtonColor: '#14b8a6', // El color teal que usas
                });
                setEditId(null);
            } else {
                await api.post('/marcas', { nombre });
                
                // --- ALERTA DE ÉXITO (CREACIÓN) ---
                Swal.fire({
                    title: '¡Marca Creada!',
                    text: 'La nueva marca ya está disponible',
                    icon: 'success',
                    confirmButtonColor: '#14b8a6',
                });
            }
            setNombre('');
            loadData();
        } catch (error) {
            // --- ALERTA DE ERROR ---
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo procesar la solicitud',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const handleDelete = async (id) => {
        // --- ALERTA DE CONFIRMACIÓN ---
        const result = await Swal.fire({
            title: '¿Eliminar marca?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/marcas/${id}`);
                loadData();
                Swal.fire({
                    title: '¡Eliminada!',
                    text: 'La marca ha sido borrada.',
                    icon: 'success',
                    confirmButtonColor: '#14b8a6',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'No se puede eliminar',
                    text: 'La marca podría estar asociada a productos existentes.',
                    confirmButtonColor: '#ef4444'
                });
            }
        }
    };

    return (
        <div className="admin-container">
            <h1 className="page-title">Gestión de Marcas</h1>

            <div className="card-form">
                <h3 className="card-title">
                    {editId ? `Editando: ${nombre}` : 'Registrar Nueva Marca'}
                </h3>
                
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="form-group flex gap-3">
                        <input 
                            type="text" 
                            placeholder="Ej. Sara, Vittoni, etc" 
                            className="input-field" 
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="btn-primary min-w-[150px]">
                            {editId ? 'ACTUALIZAR' : 'REGISTRAR'}
                        </button>
                        {editId && (
                            <button 
                                type="button" 
                                onClick={() => { setEditId(null); setNombre(''); }}
                                className="btn-nav"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card-table mt-8">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE DE LA MARCA</th>
                            <th className="text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcas.map(m => (
                            <tr key={m.id}>
                                <td>{m.id}</td>
                                <td className="font-bold">{m.nombre}</td>
                                <td className="text-center">
                                    <button 
                                        className="btn-edit" 
                                        onClick={() => { setEditId(m.id); setNombre(m.nombre); }}
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        className="btn-delete" 
                                        onClick={() => handleDelete(m.id)}
                                    >
                                        🗑️
                                    </button>
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