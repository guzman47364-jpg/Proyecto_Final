import { useContext } from 'react'; // Solo una vez
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // Importamos el carrito
import '../styles/Navbar.css';

const Navbar = () => {
    // Traemos todo lo necesario de los dos contextos
    const { user, logout } = useContext(AuthContext);
    const { totalItems } = useContext(CartContext); 

    return (
        <nav className="nav-tienda">
            <div className="nav-content">
                <Link to="/shop" className="text-xl font-black tracking-tighter text-gray-800">
                    MI<span className="text-teal-500">STORE</span>
                </Link>

                <div className="nav-links">
                    <Link to="/shop">Inicio</Link>
                    <Link to="/categorias">Categorías</Link>
                    <Link to="/ofertas">Ofertas</Link>
                </div>

                <div className="nav-usuario-esquina">
                    {/* --- ICONO DE CARRITO --- */}
                    <div className="relative cursor-pointer hover:scale-110 transition-transform mr-2">
                        <span className="text-2xl">🛒</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {totalItems}
                            </span>
                        )}
                    </div>

                    {/* --- SECCIÓN DE USUARIO --- */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-700">
                                {user?.name || "Usuario"}
                            </span>
                            <button onClick={logout} className="btn-acceso !bg-red-500">Salir</button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-acceso">Iniciar Sesión</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;