import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importa useNavigate
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, login, logout } = useContext(AuthContext);
    const { totalItems } = useContext(CartContext);
    const navigate = useNavigate(); // 2. Inicializa el hook de navegación

    const [showLogin, setShowLogin] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

   const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Llamamos al login del contexto enviando el objeto {email, password}
    const loggedUser = await login(credentials);

   if (loggedUser) {
    setShowLogin(false);
    
    // Como usas Spatie (por el getRoleNames en tu PHP), 
    // lo más seguro es que debas buscar en el array de roles:
    const roles = loggedUser.roles; // Esto es un array si usas Spatie
    const isAdmin = roles.some(r => r.name === 'Admin' || r.name === 'Vendedor');

    if (isAdmin) {
        navigate('/admin/productos');
    } else {
        navigate('/shop');
    }

    } else {
        setError('Correo o contraseña incorrectos');
    }
};

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
                    <div className="relative cursor-pointer hover:scale-110 transition-transform mr-2">
                        <span className="text-2xl">🛒</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {totalItems}
                            </span>
                        )}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-3">
                            {(user.rol === 'Admin' || user.rol === 'Vendedor') && (
                                <Link to="/admin/productos" className="text-[10px] bg-slate-100 p-1 px-2 rounded-lg font-bold hover:bg-slate-200">PANEL</Link>
                            )}
                            <span className="text-xs font-bold text-gray-700">
                                {user?.name || "Usuario"}
                            </span>
                            <button onClick={logout} className="btn-acceso !bg-red-500">Salir</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowLogin(true)} className="btn-acceso">
                            Iniciar Sesión
                        </button>
                    )}
                </div>
            </div>

            {showLogin && (
                <div className="modal-overlay" onClick={() => setShowLogin(false)}>
                    <div className="modal-login-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-x" onClick={() => setShowLogin(false)}>&times;</button>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">¡Bienvenido!</h2>
                        <p className="text-gray-400 text-sm mb-6 font-medium">Ingresa tus credenciales para continuar</p>

                        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                            <input 
                                className="modal-input"
                                type="email" 
                                placeholder="Correo electrónico"
                                value={credentials.email}
                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                required 
                            />
                            <input 
                                className="modal-input"
                                type="password" 
                                placeholder="Contraseña"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required 
                            />
                            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                            <button type="submit" className="btn-modal-submit">
                                Entrar a mi cuenta
                            </button>
                        </form>
                        <p className="mt-6 text-xs text-gray-400 font-medium">
                            ¿Aún no tienes cuenta? <span className="text-teal-500 font-bold cursor-pointer">Regístrate aquí</span>
                        </p>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;