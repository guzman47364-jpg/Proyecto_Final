import { useEffect, useState } from 'react';
import api from "../../api/axios";
import Swal from 'sweetalert2';
import '../../styles/ProductosAdmin.css';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    
    const [form, setForm] = useState({
        nombre: '', precio: '', stock: '', categoria_id: '', marca_id: '', proveedor_id: '', descripcion: ''
    });
    const [editId, setEditId] = useState(null);
    const [imagen, setImagen] = useState(null); // Estado para el archivo binario

    const loadData = async () => {
        try {
            const [resProd, resCat, resMar, resProv] = await Promise.all([
                api.get('/productos'),
                api.get('/categorias'),
                api.get('/marcas'),
                api.get('/proveedores')
            ]);
            setProductos(resProd.data);
            setCategorias(resCat.data);
            setMarcas(resMar.data);
            setProveedores(resProv.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Mapeo de datos al FormData
        formData.append('nombre', form.nombre);
        formData.append('precio', form.precio);
        formData.append('stock', form.stock);
        formData.append('categoria_id', form.categoria_id);
        formData.append('marca_id', form.marca_id);
        formData.append('proveedor_id', form.proveedor_id);
        formData.append('descripcion', form.descripcion || '');
        
        if (imagen) {
            formData.append('imagen', imagen);
        }

        try {
            if (editId) {
                formData.append('_method', 'PUT'); 
                await api.post(`/productos/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('¡Actualizado!', 'Producto modificado con éxito', 'success');
            } else {
                await api.post('/productos', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire('¡Creado!', 'Producto registrado correctamente', 'success');
            }

            // Limpieza total
            setForm({ nombre: '', precio: '', stock: '', categoria_id: '', marca_id: '', proveedor_id: '', descripcion: '' });
            setImagen(null);
            setEditId(null);
            document.getElementById('input-imagen').value = ""; // Reset físico del input
            loadData();
        } catch (error) {
            console.error(error.response?.data);
            Swal.fire('Error', 'No se pudo guardar el producto. Revisa los datos.', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/productos/${id}`);
                loadData();
                Swal.fire('Borrado', 'Producto eliminado', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
        }
    };

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const currentRecords = productos.slice(firstIndex, lastIndex); 
    const nPages = Math.ceil(productos.length / recordsPerPage);

    const nextPage = () => { if(currentPage !== nPages) setCurrentPage(currentPage + 1); };
    const prevPage = () => { if(currentPage !== 1) setCurrentPage(currentPage - 1); };

    return (
        <div className="admin-productos-wrapper">
            <div className="form-gestion-card">
                <h2>{editId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit} className="grid-inputs-admin">
                    <div className="campo-admin">
                        <label>Nombre del producto</label>
                        <input className="input-admin" placeholder="Ej. Audífonos Bluetooth" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required />
                    </div>
                    
                    <div className="campo-admin">
                        <label>Precio</label>
                        <input className="input-admin" type="number" step="0.01" placeholder="$0.00" value={form.precio} onChange={(e) => setForm({...form, precio: e.target.value})} required />
                    </div>

                    <div className="campo-admin">
                        <label>Stock Inicial</label>
                        <input className="input-admin" type="number" placeholder="0" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} required />
                    </div>

                    <div className="campo-admin">
                        <label>Categoría</label>
                        <select className="select-admin" value={form.categoria_id} onChange={(e) => setForm({...form, categoria_id: e.target.value})} required>
                            <option value="">Selecciona Categoría</option>
                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                        </select>
                    </div>

                    <div className="campo-admin">
                        <label>Marca</label>
                        <select className="select-admin" value={form.marca_id} onChange={(e) => setForm({...form, marca_id: e.target.value})} required>
                            <option value="">Selecciona Marca</option>
                            {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                        </select>
                    </div>

                    <div className="campo-admin">
                        <label>Proveedor</label>
                        <select className="select-admin" value={form.proveedor_id} onChange={(e) => setForm({...form, proveedor_id: e.target.value})} required>
                            <option value="">Selecciona Proveedor</option>
                            {proveedores.map(prov => <option key={prov.id} value={prov.id}>{prov.nombre}</option>)}
                        </select>
                    </div>

                    {/* NUEVO CAMPO: IMAGEN */}
                    <div className="campo-admin">
                        <label>Imagen del Producto</label>
                        <input 
                            id="input-imagen"
                            type="file" 
                            accept="image/*"
                            className="input-admin-file"
                            onChange={(e) => setImagen(e.target.files[0])}
                        />
                    </div>

                    <div className="campo-admin descripcion-full">
                        <label>Descripción</label>
                        <textarea className="textarea-admin" placeholder="Detalles del producto..." value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})}></textarea>
                    </div>
                    
                    <div className="lg:col-span-3">
                        <button type="submit" className="btn-guardar-admin">
                            {editId ? 'Actualizar Producto' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="tabla-gestion-container">
                <table className="tabla-productos-admin">
                    <thead>
                        <tr>
                            <th>Miniatura</th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map(p => (
                            <tr key={p.id}>
                                <td>
                                    {p.imagen ? (
                                        <img 
                                            src={`http://localhost:8000/storage/${p.imagen}`} 
                                            alt={p.nombre} 
                                            className="img-tabla-preview"
                                        />
                                    ) : (
                                        <span className="no-img-label">Sin foto</span>
                                    )}
                                </td>
                                <td className="nombre-producto-resaltado">{p.nombre}</td>
                                <td>${p.precio}</td>
                                <td>
                                    <span className={`stock-badge ${p.stock < 10 ? 'low' : ''}`}>{p.stock}</span>
                                </td>
                                <td>{p.categoria?.nombre || 'S/C'}</td>
                                <td className="text-center">
                                    <button className="btn-edit" onClick={() => {setEditId(p.id); setForm(p)}}>✏️</button>
                                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* PAGINACIÓN VISUAL */}
                <div className="pagination-admin">
                    <button onClick={prevPage} disabled={currentPage === 1} className="btn-pagi">Anterior</button>
                    <span className="info-pagi">Página {currentPage} de {nPages}</span>
                    <button onClick={nextPage} disabled={currentPage === nPages} className="btn-pagi">Siguiente</button>
                </div>
            </div>
        </div>
    );
};

export default Productos;