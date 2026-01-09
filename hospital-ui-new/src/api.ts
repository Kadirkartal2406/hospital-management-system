import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Yerel çalıştırmada port 8080'dir
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;