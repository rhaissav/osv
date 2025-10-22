import axios from 'axios';
import { parseJwt } from '../utils/jwt';

const api = axios.create({
    baseURL: 'https://osv-do5t.onrender.com',
});

let refreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshToken() {
    if (refreshing && refreshPromise) return refreshPromise;
    refreshing = true;
    refreshPromise = api.post('/refresh-token').then(res => {
        localStorage.setItem('token', res.data.token);
        refreshing = false;
        return res.data.token;
    }).catch(err => {
        refreshing = false;
        localStorage.removeItem('token');
        throw err;
    });
    return refreshPromise;
}

// Interceptor para adicionar o token JWT e fazer refresh se necessário
api.interceptors.request.use(async (config) => {
    console.log('axios interceptor: request', config);
    // Não tenta refresh em /login ou /refresh-token
    if (config.url && (config.url.includes('/login') || config.url.includes('/refresh-token'))) {
        return config;
    }
    let token = localStorage.getItem('token');
    if (token) {
        // Checa expiração do token
        const payload = parseJwt(token);
        if (payload && payload.exp) {
            const now = Math.floor(Date.now() / 1000);
            // Se faltar menos de 5 minutos para expirar, faz refresh
            if (payload.exp - now < 300) {
                try {
                    token = await refreshToken();
                } catch {
                    // Se falhar, remove token e segue sem
                    token = null;
                }
            }
        }
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
