import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Header from '../components/Header';

export default function PasswordRecovery() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!email.trim()) {
            setError('Informe seu e-mail para recuperar a senha');
            return;
        }
        setIsLoading(true);
        try {
            await api.post('/password-recovery', { email: email.trim() });
            setSuccess('Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao solicitar recuperação de senha');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-neutral-900 dark:to-neutral-800 dark:bg-gradient-to-br">
            <Header />
            <div className="pt-16 flex flex-col md:flex-row items-center justify-center min-h-[80vh] w-full">
                <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md"
                >
                    <h2 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-neutral-100">Recuperar senha</h2>
                    <p className="text-center text-gray-500 dark:text-neutral-300 mb-6">Informe seu e-mail para receber as instruções de redefinição</p>
                    <ErrorMessage message={error} />
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-center text-sm">
                            {success}
                        </div>
                    )}
                    <Input
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="Digite seu e-mail"
                    />
                    <Button variant="primary" disabled={isLoading} type="submit">
                        {isLoading ? 'Enviando...' : 'Enviar instruções'}
                    </Button>
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-neutral-300">
                        Lembrou a senha?{' '}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Fazer login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
