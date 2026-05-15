import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, login, logout } = useContext(AuthContext);
    const { totalItems } = useContext(CartContext);
    const navigate = useNavigate();

    const [showLogin, setShowLogin] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const loggedUser = await login(credentials);

        if (loggedUser) {
            setShowLogin(false);
            
            // Lógica de redirección basada en roles
            const roles = loggedUser.roles; 
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

    // Función para ir al registro y cerrar el modal
    const handleGoToRegister = () => {
        setShowLogin(false);
        navigate('/registro');
    };

    return (
        <nav className="nav-tienda">
            <div className="nav-content">
                <Link to="/shop" className="logo-text">
                    F&B<span className="logo-accent">FASHION</span>
                </Link>

                <div className="nav-links">
                    <Link to="/shop">Inicio</Link>
                    <Link to="/categorias">Categorías</Link>
                    <Link to="/ofertas">Ofertas</Link>
                </div>

                <div className="nav-usuario-esquina">
                    <div className="cart-wrapper" onClick={() => navigate('/carrito')}>
                        <span className="text-xl">🛒</span>
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {(user.rol === 'Admin' || user.rol === 'Vendedor') && (
                                <Link to="/admin/productos" className="panel-link">PANEL</Link>
                            )}
                            <span className="user-tag">
                                {user?.name?.split(' ')[0] || "Usuario"}
                            </span>
                            <button onClick={logout} className="btn-acceso !bg-red-500">Salir</button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            {/* BOTÓN REGISTRARSE (Visible fuera del modal) */}
                            <button onClick={() => navigate('/registro')} className="btn-acceso !bg-transparent !text-gray-600 border border-gray-200">
                                Registrarse
                            </button>
                            
                            <button onClick={() => setShowLogin(true)} className="btn-acceso">
                                Iniciar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showLogin && (
                <div className="modal-overlay" onClick={() => setShowLogin(false)}>
                    <div className="modal-login-card" onClick={(e) => e.stopPropagation()}>
                        <button className="close-x" onClick={() => setShowLogin(false)}>&times;</button>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">¡Hola de nuevo!</h2>
                            <p className="text-gray-400 text-xs font-medium mt-1">Ingresa a tu cuenta para continuar</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                            <div className="space-y-1">
                                <label className="modal-label">Email</label>
                                <input 
                                    className="modal-input"
                                    type="email" 
                                    placeholder="tu@correo.com"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                    required 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="modal-label">Contraseña</label>
                                <input 
                                    className="modal-input"
                                    type="password" 
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                    required 
                                />
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" className="btn-modal-submit">
                                Entrar ahora
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-[10px] text-gray-400 font-medium">
                                ¿No tienes cuenta? <span 
                                    onClick={handleGoToRegister} 
                                    className="text-teal-500 font-black cursor-pointer hover:underline"
                                >
                                    Regístrate aquí
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;