import { useEffect, useState } from 'react';
import api from "../../api/axios";
import Swal from 'sweetalert2';
import '../../styles/Categorias.css'; 

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nombre, setNombre] = useState('');
    const [imagen, setImagen] = useState(null); // Nuevo estado para la imagen
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
        
        // Usamos FormData para poder enviar archivos
        const formData = new FormData();
        formData.append('nombre', nombre);
        if (imagen) {
            formData.append('imagen', imagen);
        }

        try {
            if (editId) {
                // Laravel tiene un detalle: a veces el PUT no reconoce archivos.
                // Es mejor enviar un POST y simular el PUT con _method.
                formData.append('_method', 'PUT');
                await api.post(`/categorias/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                
                Swal.fire({ title: '¡Actualizado!', text: 'Categoría modificada con éxito', icon: 'success' });
                setEditId(null);
            } else {
                await api.post('/categorias', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire({ title: '¡Creado!', text: 'Categoría registrada con éxito', icon: 'success' });
            }
            
            setNombre('');
            setImagen(null);
            // Limpiar el input de archivo manualmente
            document.getElementById('input-imagen').value = "";
            loadData();
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo guardar la información',
                icon: 'error',
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
            confirmButtonText: 'Sí, borrar',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/categorias/${id}`);
                await loadData();
                Swal.fire('¡Borrado!', 'La categoría ha sido eliminada.', 'success');
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'No se puede eliminar', text: 'Esta categoría tiene productos asociados.' });
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="form-group">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nombre</label>
                            <input 
                                type="text" 
                                placeholder="Ej. Camisas, Pantalones..." 
                                className="input-field" 
                                value={nombre} 
                                onChange={e => setNombre(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Imagen Portada</label>
                            <input 
                                id="input-imagen"
                                type="file" 
                                className="input-field" 
                                onChange={e => setImagen(e.target.files[0])} 
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button type="submit" className="btn-primary flex-grow">
                            {editId ? 'GUARDAR CAMBIOS' : 'CREAR CATEGORÍA'}
                        </button>

                        {editId && (
                            <button 
                                type="button" 
                                onClick={() => { setEditId(null); setNombre(''); setImagen(null); }}
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
                            <th>IMAGEN</th>
                            <th>NOMBRE</th>
                            <th className="text-center">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.length > 0 ? categorias.map(c => (
                            <tr key={c.id}>
                                <td className="w-20">
                                    {c.imagen ? (
                                        <img 
                                            src={`http://localhost:8000/storage/${c.imagen}`} 
                                            className="w-12 h-12 object-cover rounded-xl shadow-sm" 
                                            alt={c.nombre} 
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xs">📂</div>
                                    )}
                                </td>
                                <td className="font-bold">{c.nombre}</td>
                                <td className="text-center">
                                    <button className="btn-edit" onClick={() => { setEditId(c.id); setNombre(c.nombre); }}>✏️</button>
                                    <button className="btn-delete" onClick={() => handleDelete(c.id)}>🗑️</button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" className="text-center py-10 text-gray-400">No hay categorías registradas</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categorias;