import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const sendChatRequest = async (question) => {
    try {
        const response = await api.post('/chat', { question });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const triggerIngestion = async () => {
    try {
        const response = await api.post('/ingest');
        return response.data;
    } catch (error) {
        console.error('Ingestion Error:', error);
        throw error;
    }
};

export default api;
