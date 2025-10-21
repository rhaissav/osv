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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-center min-h-[80vh]">
            <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-0 h-56 md:h-auto">
              <img
                src="/login-illustration.svg"
                alt="Ilustração"
                className="w-40 h-40 md:w-[80%] md:max-h-96 drop-shadow-lg object-contain"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Bem-vindo</h2>
              <p className="text-center text-gray-500 mb-6">Acesse sua conta para continuar</p>
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
                <Link to="/password-recovery" className="text-sm text-blue-600 hover:underline">
                  Esqueceu sua senha?
                </Link>
              </div>
              <Button type="submit" variant="primary">Entrar</Button>
              <div className="mt-2 text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/register" className="text-blue-600 hover:underline font-medium">
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