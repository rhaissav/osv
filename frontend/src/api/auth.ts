import api from './axios';

export async function login(email: string, password: string) {
    console.log('axios login called with', { email, password });
    try {
        console.log('antes do await axios.post');
        const response = await api.post('/login', { email, password });
        console.log('depois do await axios.post', response);
        console.log('axios login response', response.data);
        return response.data;
    } catch (err) {
        console.error('axios login error', err);
        throw err;
    }
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}