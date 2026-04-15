import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginService } from '../../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        // 1. Llamamos al servicio
        const res = await loginService(email, password);
        console.log("1. Respuesta completa del servidor:", res);
        console.log("2. ¿Tiene roles?:", res.user?.roles);
        // 2. IMPORTANTE: Extraemos según tu estructura de Laravel (res.data.user)
        // Si tu servicio ya hace el "return response.data.data", usa solo 'res'
        const userData = res.user; 
        const token = res.access_token;

        // 3. Guardamos en el Contexto
        login(userData, token);
        
        const roles = res.user.roles.map(rol => rol.name); 

        console.log("Nombres de roles extraídos:", roles); // Debería salir ['Admin']

        // 2. Comprobamos si 'Admin' está en la lista
        if (roles.includes('Admin')) {
            console.log("Redirigiendo al panel de administración...");
            navigate('/admin/usuarios'); // Asegúrate que esta ruta exista en tu App.jsx
        } else {
            console.log("Redirigiendo a la tienda...");
            navigate('/shop');
        }
    } catch (err) {
        // Si el error es un objeto, extraemos el mensaje
        setError(err.response?.data?.message || "Error al conectar con el servidor");
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Iniciar Sesión
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="correo@ejemplo.com"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-teal-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors duration-300 transform active:scale-95"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;