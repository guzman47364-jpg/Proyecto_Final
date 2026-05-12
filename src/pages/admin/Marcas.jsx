import { useEffect, useState } from 'react';
import api from "../../api/axios";
import '../../styles/Marcas.css'; 

const Marcas = () => {
    const [marcas, setMarcas] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editId, setEditId] = useState(null);

    // 1. Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

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
                setEditId(null);
            } else {
                await api.post('/marcas', { nombre });
            }
            setNombre('');
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Deseas eliminar esta marca?")) {
            try {
                await api.delete(`/marcas/${id}`);
                loadData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // 2. Lógica de paginación (Corregida: de productos a marcas)
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    
    // IMPORTANTE: Esto es lo que se muestra en la tabla
    const currentRecords = marcas.slice(firstIndex, lastIndex); 
    const nPages = Math.ceil(marcas.length / recordsPerPage);

    const nextPage = () => { if(currentPage !== nPages) setCurrentPage(currentPage + 1); };
    const prevPage = () => { if(currentPage !== 1) setCurrentPage(currentPage - 1); };

    return (
        <div className="marcas-container">
            <div className="form-card">
                <h2>Gestión de Marcas</h2>
                <form onSubmit={handleSubmit} className="form-inline">
                    <input 
                        className="input-brand"
                        value={nombre} 
                        onChange={e => setNombre(e.target.value)} 
                        placeholder="Nombre de la marca"
                        required 
                    />
                    <button type="submit" className="btn-save">
                        {editId ? 'Actualizar' : 'Guardar'}
                    </button>
                </form>
            </div>

            <div className="table-card">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* CAMBIO CLAVE: Usar currentRecords en lugar de marcas */}
                        {currentRecords.map(m => (
                            <tr key={m.id}>
                                <td>{m.id}</td>
                                <td>{m.nombre}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => { setEditId(m.id); setNombre(m.nombre); }}>Editar</button>
                                    <button className="btn-delete" onClick={() => handleDelete(m.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginador corregido */}
            {marcas.length > recordsPerPage && (
                <div className="pagination-wrapper">
                    <div className="pagination-info">
                        Mostrando <span>{firstIndex + 1}</span> a <span>{Math.min(lastIndex, marcas.length)}</span> de <span>{marcas.length}</span> registros
                    </div>
                    <div className="pagination-buttons">
                        <button 
                            onClick={prevPage} 
                            className={`btn-pag ${currentPage === 1 ? 'disabled' : ''}`}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        
                        {[...Array(nPages).keys()].map(n => (
                            <button 
                                key={n + 1} 
                                onClick={() => setCurrentPage(n + 1)}
                                className={`page-number ${currentPage === n + 1 ? 'active' : ''}`}
                            >
                                {n + 1}
                            </button>
                        ))}

                        <button 
                            onClick={nextPage} 
                            className={`btn-pag ${currentPage === nPages ? 'disabled' : ''}`}
                            disabled={currentPage === nPages}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marcas;