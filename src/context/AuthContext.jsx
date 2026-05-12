import { createContext, useState, useEffect } from 'react';
import api from '../api/axios'; // Importa tu configuración de axios

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Agregamos una validación extra: que savedUser no sea nulo ni sea el texto "undefined"
    if (savedUser && savedUser !== "undefined" && token) {
        try {
            setUser(JSON.parse(savedUser));
        } catch (error) {
            console.error("Error parseando el usuario del localStorage", error);
            // Si el JSON está mal, mejor limpiamos todo
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }
    setLoading(false);
}, []);

const login = async (credentials) => {
    try {
        // 1. Apuntamos a la ruta correcta que vimos en el route:list
        const res = await api.post('auth/login', credentials); 
        
        // 2. IMPORTANTE: Tu Trait ApiResponse guarda todo en res.data.data
        // res.data es la respuesta de Axios
        // res.data.data es el objeto 'data' que envía tu controlador
        const responseData = res.data.data; 

        if (responseData && responseData.access_token) {
            const token = responseData.access_token;
            const user = responseData.user;

            // 3. Guardamos en LocalStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // 4. Actualizamos el estado global
            setUser(user);

            return user; // Devolvemos el usuario para que el Navbar haga el navigate
        }
        
        return null;
    } catch (error) {
        console.error("Error en Login:", error.response?.data);
        return null;
    }
};

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};