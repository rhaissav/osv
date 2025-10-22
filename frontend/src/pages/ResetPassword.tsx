import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!password || password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (password !== confirm) {
            setError('As senhas não coincidem.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/reset-password', { token, password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Erro ao redefinir senha.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">Token inválido ou ausente.</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4 border border-neutral-200">
                <h2 className="text-2xl font-bold mb-2 text-center text-neutral-900">Redefinir Senha</h2>
                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                {success && <div className="text-green-600 text-sm text-center">Senha redefinida com sucesso! Redirecionando...</div>}
                <label className="block">
                    <span className="text-sm font-medium">Nova senha</span>
                    <input
                        type="password"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 mt-1"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        minLength={6}
                        required
                        autoFocus
                    />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Confirmar nova senha</span>
                    <input
                        type="password"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 mt-1"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        minLength={6}
                        required
                    />
                </label>
                <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition mt-2"
                    disabled={loading}
                >
                    {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
