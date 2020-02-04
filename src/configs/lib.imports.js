import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:9090/api/',
    timeout: 5000,
});

export {http};