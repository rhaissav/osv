import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Button from '../components/Button';

export default function CompleteSignup() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email') || '';
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!name || !password || !confirmPassword) {
            setError('Preencha todos os campos.');
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/auth/complete-signup', { email, name, password });
            setSuccess('Cadastro completado com sucesso! Redirecionando para login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Erro ao completar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 p-8 rounded-xl shadow-md w-full max-w-md border border-neutral-200 dark:border-neutral-700">
                <h2 className="text-2xl font-bold mb-4 text-center text-neutral-900 dark:text-neutral-100">Completar Cadastro</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">E-mail</label>
                    <input type="email" value={email} disabled className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100" />
                </div>
                {error && <div className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</div>}
                {success && <div className="text-green-600 dark:text-green-400 text-sm mb-2">{success}</div>}
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Enviando...' : 'Completar Cadastro'}</Button>
            </form>
        </div>
    );
}
