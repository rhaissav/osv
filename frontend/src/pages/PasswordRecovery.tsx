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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <Header />
            <div className="pt-16 flex flex-col md:flex-row items-center justify-center min-h-[80vh] w-full">
                <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-0 h-56 md:h-auto">
                    <img
                        src="/password-recovery-illustration.svg"
                        alt="Ilustração de recuperação de senha"
                        className="w-40 h-40 md:w-[80%] md:max-h-96 drop-shadow-lg object-contain"
                    />
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center"
                >
                    <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Recuperar senha</h2>
                    <p className="text-center text-gray-500 mb-6">Informe seu e-mail para receber as instruções de redefinição</p>
                    <ErrorMessage message={error} />
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center text-sm">
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
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Lembrou a senha?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Fazer login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
