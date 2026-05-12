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
        try {
            if (editId) {
                await api.put(`/productos/${editId}`, form);
                Swal.fire('¡Actualizado!', 'Producto modificado con éxito', 'success');
            } else {
                await api.post('/productos', form);
                Swal.fire('¡Creado!', 'Producto registrado correctamente', 'success');
            }
            setForm({ nombre: '', precio: '', stock: '', categoria_id: '', marca_id: '', proveedor_id: '', descripcion: '' });
            setEditId(null);
            loadData();
        } catch (error) {
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
// 1. Nuevos estados para la paginación
const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 10;

// 2. Lógica para calcular qué registros mostrar
const lastIndex = currentPage * recordsPerPage;
const firstIndex = lastIndex - recordsPerPage;
const currentRecords = productos.slice(firstIndex, lastIndex); // Cambia 'productos' por 'marcas', etc.
const nPages = Math.ceil(productos.length / recordsPerPage);

// 3. Función para cambiar de página
const nextPage = () => { if(currentPage !== nPages) setCurrentPage(currentPage + 1); };
const prevPage = () => { if(currentPage !== 1) setCurrentPage(currentPage - 1); };
    return (
        <div className="admin-productos-wrapper">
            <div className="form-gestion-card">
                <h2>{editId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <form onSubmit={handleSubmit} className="grid-inputs-admin">
                    <div className="campo-admin">
                        <label>Nombre del producto</label>
                        <input 
                            className="input-admin" 
                            placeholder="Ej. Audífonos Bluetooth" 
                            value={form.nombre}
                            onChange={(e) => setForm({...form, nombre: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div className="campo-admin">
                        <label>Precio</label>
                        <input 
                            className="input-admin" 
                            type="number"
                            step="0.01"
                            placeholder="$0.00" 
                            value={form.precio}
                            onChange={(e) => setForm({...form, precio: e.target.value})}
                            required
                        />
                    </div>

                    <div className="campo-admin">
                        <label>Stock Inicial</label>
                        <input 
                            className="input-admin" 
                            type="number"
                            placeholder="0" 
                            value={form.stock}
                            onChange={(e) => setForm({...form, stock: e.target.value})}
                            required
                        />
                    </div>

                   {/* Categoría */}
                    <div className="campo-admin">
                        <label>Categoría</label>
                        <select 
                            className="select-admin"
                            value={form.categoria_id}
                            onChange={(e) => {
                                setForm({...form, categoria_id: e.target.value});
                                e.target.blur(); 
                            }}
                            onFocus={(e) => (e.target.size = 5)} 
                            onBlur={(e) => (e.target.size = 1)}
                            required
                        >
                            <option value="">Selecciona Categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Marca */}
                    <div className="campo-admin">
                        <label>Marca</label>
                        <select 
                            className="select-admin"
                            value={form.marca_id}
                            onChange={(e) => {
                                setForm({...form, marca_id: e.target.value});
                                e.target.blur();
                            }}
                            onFocus={(e) => (e.target.size = 5)} 
                            onBlur={(e) => (e.target.size = 1)}
                            required
                        >
                            <option value="">Selecciona Marca</option>
                            {marcas.map(m => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Proveedor */}
                    <div className="campo-admin">
                        <label>Proveedor</label>
                        <select 
                            className="select-admin"
                            value={form.proveedor_id}
                            onChange={(e) => {
                                setForm({...form, proveedor_id: e.target.value});
                                e.target.blur();
                            }}
                            onFocus={(e) => (e.target.size = 5)} 
                            onBlur={(e) => (e.target.size = 1)}
                            required
                        >
                            <option value="">Selecciona Proveedor</option>
                            {proveedores.map(prov => (
                                <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                            ))}
                        </select>
</div>

                    <div className="campo-admin descripcion-full">
                        <label>Descripción</label>
                        <textarea 
                            className="textarea-admin" 
                            placeholder="Detalles del producto..."
                            value={form.descripcion}
                            onChange={(e) => setForm({...form, descripcion: e.target.value})}
                        ></textarea>
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
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(p => (
                            <tr key={p.id}>
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
            </div>
        </div>
    );
};

export default Productos;