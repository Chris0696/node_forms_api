// Service API — centralise tous les appels HTTP vers le backend
// C'est comme créer un client requests.Session() en Python avec un base_url
import axios from 'axios';

// axios.create() = crée une instance avec une config par défaut
// Toutes les requêtes partiront de cette URL de base
const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
});

// Intercepteur = middleware côté client
// S'exécute AVANT chaque requête (comme un middleware Express, mais côté front)
// Il ajoute automatiquement le header Authorization: Bearer <token>
api.interceptors.request.use((config) => {
    // localStorage = stockage persistant dans le navigateur (comme les cookies)
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
