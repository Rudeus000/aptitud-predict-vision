import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Cambia esto si tu backend está en otra URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('archivo', file);

    try {
        const response = await api.post('/subir-documento', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al subir el documento:', error);
        throw error;
    }
};

export const processDocument = async (documentId: number) => {
    try {
        const response = await api.post(`/procesar/${documentId}`);
        return response.data;
    } catch (error) {
        console.error('Error al procesar el documento:', error);
        throw error;
    }
}; 