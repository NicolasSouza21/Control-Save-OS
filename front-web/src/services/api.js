import axios from 'axios';

const api = axios.create({
    // ✅ Configurado para seu IP específico
    baseURL: 'http://192.168.0.11:8080', 
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("❌ Erro na API:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;