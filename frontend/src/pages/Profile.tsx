
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Button from '../components/Button';
import { FaUser, FaEnvelope, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState<{ name: string; email: string }>({ name: '', email: '' });
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/me')
            .then(res => {
                setUser({ name: res.data.name, email: res.data.email });
                setName(res.data.name);
                setEmail(res.data.email);
            })
            .catch(() => setError('Erro ao carregar perfil'))
            .finally(() => setLoading(false));
    }, []);

    function handleSave() {
        setError('');
        setSuccess('');
        api.put('/me', { name, email })
            .then(() => {
                setUser(u => ({ ...u, name, email }));
                setEdit(false);
                setSuccess('Perfil atualizado com sucesso!');
            })
            .catch(() => setError('Erro ao atualizar perfil.'));
    }

    function handleDelete() {
        setError('');
        setSuccess('');
        api.delete('/me')
            .then(() => {
                localStorage.removeItem('token');
                navigate('/register');
            })
            .catch(() => setError('Erro ao excluir perfil.'));
    }

    if (loading) return <div className="p-8 text-gray-500">Carregando...</div>;

    return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-10">
            <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 text-blue-600 rounded-full p-4">
                    <FaUser size={32} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        {edit ? (
                            <input
                                className="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-200"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <span className="text-xl font-bold text-gray-800">{user.name}</span>
                        )}
                        {!edit && (
                            <button
                                className="ml-2 text-blue-500 hover:text-blue-700"
                                onClick={() => setEdit(true)}
                                title="Editar perfil"
                            >
                                <FaEdit />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                        <FaEnvelope />
                        {edit ? (
                            <input
                                className="border px-2 py-1 rounded focus:ring-2 focus:ring-blue-200"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        ) : (
                            <span className="text-sm">{user.email}</span>
                        )}
                    </div>
                </div>
            </div>
            {edit && (
                <div className="flex gap-2 mt-2">
                    <Button variant="primary" onClick={handleSave} className="w-auto px-4">Salvar</Button>
                    <Button variant="secondary" onClick={() => { setEdit(false); setName(user.name); setEmail(user.email); }} className="w-auto px-4">Cancelar</Button>
                </div>
            )}
            <div className="mt-8 border-t pt-6">
                {!confirmDelete ? (
                    <Button variant="danger" onClick={() => setConfirmDelete(true)} className="w-auto px-4 flex items-center gap-2">
                        <FaTrash /> Excluir perfil
                    </Button>
                ) : (
                    <div className="flex gap-2 items-center">
                        <span className="text-red-600 font-medium">Tem certeza? Esta ação não pode ser desfeita.</span>
                        <Button variant="danger" onClick={handleDelete} className="w-auto px-4">Confirmar</Button>
                        <Button variant="secondary" onClick={() => setConfirmDelete(false)} className="w-auto px-4">Cancelar</Button>
                    </div>
                )}
            </div>
            {success && <div className="mt-4 text-green-600">{success}</div>}
            {error && <div className="mt-4 text-red-600">{error}</div>}
        </div>
    );
}
