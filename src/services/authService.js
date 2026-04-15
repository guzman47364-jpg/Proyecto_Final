import api from '../api/axios'; // Asegúrate de que tu axios.js esté en src/api/

export const loginService = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        // Según tu JSON de Postman, los datos vienen en response.data.data
        return response.data.data; 
    } catch (error) {
        throw error.response?.data?.message || 'Error al iniciar sesión';
    }
};