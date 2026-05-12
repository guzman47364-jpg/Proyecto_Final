import { useEffect, useState } from 'react';
import api from "../../api/axios";
import Swal from 'sweetalert2';
import '../../styles/Categorias.css'; 

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
                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'Categoría modificada con éxito',
                    icon: 'success',
                    confirmButtonColor: '#14b8a6',
                });
                setEditId(null);
            } else {
                await api.post('/categorias', { nombre });
                Swal.fire({
                    title: '¡Creado!',
                    text: 'Categoría registrada con éxito',
                    icon: 'success',
                    confirmButtonColor: '#14b8a6',
                });
            }
            setNombre('');
            loadData();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo guardar la información',
                icon: 'error',
                confirmButtonColor: '#d33',
            });
        }
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
                await api.delete(`/categorias/${id}`);
                await loadData();
                Swal.fire('¡Borrado!', 'La categoría ha sido eliminada.', 'success');
            } catch (error) {
                // Manejo de error si la categoría ya tiene productos
                Swal.fire({
                    icon: 'error',
                    title: 'No se puede eliminar',
                    text: 'Esta categoría tiene productos asociados. Debes eliminarlos o reasignarlos primero.',
                    confirmButtonColor: '#d33'
                });
            }
        }
    };

    return (
        <div className="admin-container">
            <h1 className="page-title">Gestión de Categorías</h1>

            <div className="card-form">
                <h3 className="card-title">
                    {editId ? `Editando Categoría: ${nombre}` : 'Registrar Nueva Categoría'}
                </h3>
                
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            placeholder="Nombre de la categoría..." 
                            className="input-field" 
                            value={nombre} 
                            onChange={e => setNombre(e.target.value)} 
                            required 
                        />
                        
                        <button type="submit" className="btn-primary">
                            {editId ? 'ACTUALIZAR' : 'CREAR'}
                        </button>

                        {editId && (
                            <button 
                                type="button" 
                                onClick={() => { setEditId(null); setNombre(''); }}
                                className="btn-nav" 
                                style={{ padding: '0 20px' }}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card-table">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE</th>
                            <th className="text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.length > 0 ? categorias.map(c => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td className="font-bold">{c.nombre}</td>
                                <td className="text-center">
                                    <button 
                                        type="button"
                                        className="btn-edit"
                                        onClick={() => { setEditId(c.id); setNombre(c.nombre); }}
                                        title="Editar"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        type="button"
                                        className="btn-delete"
                                        onClick={() => handleDelete(c.id)}
                                        title="Eliminar"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="3" className="text-center text-gray-400 py-10">
                                    No hay categorías registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categorias;