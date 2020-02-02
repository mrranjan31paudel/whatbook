import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:9090/api/',
    timeout: 1000,
});

export {http};