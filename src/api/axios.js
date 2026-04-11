import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Asegúrate de que Laravel esté en el 8000
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;