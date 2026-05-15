import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', password_confirmation: '', direccion: ''
    });
    
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación de contraseñas en el cliente
        if (formData.password !== formData.password_confirmation) {
            return Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden.',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        }

        setLoading(true);
        try {
            // 1. Enviamos el registro al backend (Ruta con prefijo auth)
            await api.post('/auth/register', formData);
            
            // 2. Mostramos alerta de éxito
            await Swal.fire({
                title: '¡Cuenta creada!',
                text: 'Tu registro fue exitoso. Ya puedes iniciar sesión desde el menú.',
                icon: 'success',
                confirmButtonColor: '#14b8a6'
            });

            // 3. Lo mandamos al inicio (Shop) para que él inicie sesión manualmente
            navigate('/shop');

        } catch (error) {
            // Si el correo ya existe o hay otro error de validación
            const errorMsg = error.response?.data?.message || 'Revisa que el correo no esté registrado e intenta de nuevo.';
            Swal.fire({
                title: 'Error', 
                text: errorMsg, 
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
            <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
                <h2 className="text-4xl font-black tracking-tighter uppercase text-center mb-8">
                    Crea tu <span className="text-teal-500">Cuenta</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Nombre Completo" 
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Correo Electrónico" 
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                    <textarea 
                        placeholder="Dirección para tus entregas..." 
                        className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-teal-500 transition-all h-24 resize-none"
                        onChange={e => setFormData({...formData, direccion: e.target.value})}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="password" 
                            placeholder="Contraseña" 
                            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirmar" 
                            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                            onChange={e => setFormData({...formData, password_confirmation: e.target.value})} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-teal-500 transition-all uppercase tracking-widest text-xs mt-4 ${loading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {loading ? 'Procesando...' : 'Registrarme ahora'}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-sm text-gray-400 font-bold">
                        ¿Ya tienes cuenta? <Link to="/shop" className="text-teal-500 hover:underline">Vuelve al Inicio</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;