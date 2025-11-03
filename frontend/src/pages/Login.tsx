import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';

import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Header from '../components/Header';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit');
    setError('');
    try {
      console.log('antes do login', { email, password });
      const data = await login(email, password);
      console.log('depois do login', data);
      localStorage.setItem('token', data.token);
      navigate('/projects');
    } catch (err: any) {
      console.log('erro no login', err);
      setError(err.response?.data?.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-neutral-900 dark:to-neutral-800 dark:bg-gradient-to-br">
      <Header />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh]">
            <form
              onSubmit={handleSubmit}
              className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md"
            >
              <h2 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-neutral-100">Bem-vindo</h2>
              <p className="text-center text-gray-500 dark:text-neutral-300 mb-6">Acesse sua conta para continuar</p>
              <ErrorMessage message={error} />
              <Input
                label="E-mail"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end mb-4">
                <Link to="/password-recovery" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
              <Button type="submit" variant="primary">Entrar</Button>
              <div className="mt-2 text-center text-sm text-gray-600 dark:text-neutral-300">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Cadastre-se
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}