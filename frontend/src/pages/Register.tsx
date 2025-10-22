import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Header from '../components/Header';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validação de campos obrigatórios
        if (!name.trim()) {
            setError('Nome é obrigatório');
            return;
        }
        if (!email.trim()) {
            setError('E-mail é obrigatório');
            return;
        }
        if (!password) {
            setError('Senha é obrigatória');
            return;
        }
        if (!confirmPassword) {
            setError('Confirmação de senha é obrigatória');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/register', {
                name: name.trim(),
                email: email.trim(),
                password
            });
            // Se o registro for bem-sucedido, redireciona para login
            navigate('/login', {
                state: { message: 'Conta criada com sucesso! Faça login para continuar.' }
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erro ao criar conta');
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
                        src="/register-illustration.svg"
                        alt="Ilustração de cadastro"
                        className="w-40 h-40 md:w-[80%] md:max-h-96 drop-shadow-lg object-contain"
                    />
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center"
                >
                    <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Criar conta</h2>
                    <p className="text-center text-gray-500 mb-6">Junte-se a nós e comece a visualizar seus dados</p>

                    <ErrorMessage message={error} />

                    <Input
                        label="Nome completo"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Digite seu nome completo"
                    />

                    <Input
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="Digite seu e-mail"
                    />

                    <Input
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="Mínimo 6 caracteres"
                    />

                    <Input
                        label="Confirmar senha"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Digite a senha novamente"
                    />

                    <Button
                        variant="primary"
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading ? 'Criando conta...' : 'Criar conta'}
                    </Button>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Faça login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

