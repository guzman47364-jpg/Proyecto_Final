import api from './api';

export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        // Importante: Revisa si Laravel devuelve los datos en .data o .data.data
        return response.data; 
    } catch (error) {
        console.error("Error en getUsers service:", error);
        throw error;
    }
};

// Aquí puedes agregar más funciones después
export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};