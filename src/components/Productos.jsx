import { useEffect, useState } from 'react';
// Usamos la ruta que YA sabemos que te funciona
import api from '../api/axios';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]); // <--- Agregado
    
    // Agregado categoria_id y proveedor_id al form
    const [form, setForm] = useState({ 
        nombre: '', 
        precio: '', 
        stock: '', 
        marca_id: '', 
        categoria_id: '',
        proveedor_id: '' 
    }); 
    
    const [editId, setEditId] = useState(null);

    const loadData = async () => {
        try {
            // Cargamos las 4 cosas al mismo tiempo
            const [pRes, mRes, cRes, provRes] = await Promise.all([
                api.get('/productos'),
                api.get('/marcas'),
                api.get('/categorias'),
                api.get('/proveedores') // <--- Carga proveedores
            ]);
            setProductos(Array.isArray(pRes.data) ? pRes.data : []);
            setMarcas(Array.isArray(mRes.data) ? mRes.data : []);
            setCategorias(Array.isArray(cRes.data) ? cRes.data : []);
            setProveedores(Array.isArray(provRes.data) ? provRes.data : []);
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
                setEditId(null);
            } else {
                await api.post('/productos', form);
            }
            // Limpiamos todo el form
            setForm({ nombre: '', precio: '', stock: '', marca_id: '', categoria_id: '', proveedor_id: '' });
            loadData();
            alert("¡Guardado correctamente!");
        } catch (error) {
            // Ahora el alert te dirá qué falta si hay error
            console.error(error);
            alert("Error al guardar: " + (error.response?.data?.message || "Revisa los campos"));
        }
    };

    const deleteProducto = async (id) => {
        if (confirm('¿Eliminar producto?')) {
            await api.delete(`/productos/${id}`);
            loadData();
        }
    };

    return (
        <div className="section-container fade-in">
            <div className="section-header">
                <h2>Gestión de Inventario</h2>
                <p>Agrega, edita o elimina productos con su proveedor.</p>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group span-2">
                    <label>Nombre del Producto</label>
                    <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej: Laptop Gamer" required />
                </div>
                <div className="form-group">
                    <label>Precio</label>
                    <input type="number" step="0.01" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} placeholder="0.00" required />
                </div>
                <div className="form-group">
                    <label>Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="0" required />
                </div>
                
                <div className="form-group">
                    <label>Marca</label>
                    <select value={form.marca_id} onChange={e => setForm({...form, marca_id: e.target.value})} required>
                        <option value="">-- Marca --</option>
                        {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label>Categoría</label>
                    <select value={form.categoria_id} onChange={e => setForm({...form, categoria_id: e.target.value})} required>
                        <option value="">-- Categoría --</option>
                        {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                </div>

                {/* SELECT DE PROVEEDOR (NUEVO) */}
                <div className="form-group">
                    <label>Proveedor</label>
                    <select value={form.proveedor_id} onChange={e => setForm({...form, proveedor_id: e.target.value})} required>
                        <option value="">-- Proveedor --</option>
                        {proveedores.map(prov => (
                            <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group form-button">
                    <button type="submit">
                        {editId ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </form>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th className="th-main">PRODUCTO</th>
                            <th className="th-center">STOCK</th>
                            <th className="th-center">PRECIO</th>
                            <th className="th-actions">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map(p => (
                                <tr key={p.id}>
                                    <td className="td-main">
                                        <span className="p-nombre">{p.nombre}</span>
                                        <span className="p-marca">
                                            {p.marca?.nombre || 'S/M'} • {p.categoria?.nombre || 'S/C'} • {p.proveedor?.nombre || 'S/P'}
                                        </span>
                                    </td>
                                    <td className="td-center">
                                        <span className={p.stock < 10 ? "stock badge-red" : "stock badge-green"}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="td-center p-precio">${p.precio}</td>
                                    <td className="td-actions">
                                        <button onClick={() => { setEditId(p.id); setForm(p); }} className="btn-edit">Editar</button>
                                        <button onClick={() => deleteProducto(p.id)} className="btn-delete">Borrar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" className="td-empty">No hay productos guardados aún.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Productos;