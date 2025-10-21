
import { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { deleteProject } from '../api/project';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface Project {
    id: string;
    name: string;
    description?: string;
    role?: 'OWNER' | 'MEMBER';
    status?: string;
}



export default function Projects() {
    const [modalOpen, setModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    // Função para remover projeto
    async function handleDeleteProject() {
        if (!projectToDelete) return;
        try {
            await deleteProject(projectToDelete.id);
            setMeusProjetos(prev => prev.filter(p => p.id !== projectToDelete.id));
            setColaboradorProjetos(prev => prev.filter(p => p.id !== projectToDelete.id));
            setDeleteSuccess(true);
        } catch {
            setError('Erro ao remover projeto.');
        } finally {
            setModalOpen(false);
            setProjectToDelete(null);
            setTimeout(() => setDeleteSuccess(false), 3000);
        }
    }
    const [meusProjetos, setMeusProjetos] = useState<Project[]>([]);
    const [colaboradorProjetos, setColaboradorProjetos] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState<'meus' | 'colaborador'>('meus');
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/projects')
            .then(res => {
                console.log('Projetos recebidos:', res.data);
                const adapt = (p: any) => ({
                    ...p,
                    name: p.name || p.title,
                });
                setMeusProjetos(Array.isArray(res.data?.meusProjetos) ? res.data.meusProjetos.map(adapt) : []);
                setColaboradorProjetos(Array.isArray(res.data?.colaboradorProjetos) ? res.data.colaboradorProjetos.map(adapt) : []);
            })
            .catch(() => setError('Erro ao carregar projetos'))
            .finally(() => setLoading(false));
    }, []);

    const projetosAtuais = tab === 'meus' ? meusProjetos : colaboradorProjetos;
    const filtered = projetosAtuais.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-10 px-2 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Projetos</h1>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center gap-2"
                        onClick={() => navigate('/projects/new')}
                    >
                        <FaPlus className="text-base" />
                        <span className="hidden sm:inline">Novo projeto</span>
                    </button>
                </div>
                <div className="flex gap-2 border-b mb-4">
                    <button
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === 'meus' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                        onClick={() => setTab('meus')}
                    >Meus Projetos</button>
                    <button
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${tab === 'colaborador' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-600'}`}
                        onClick={() => setTab('colaborador')}
                    >Projetos como Colaborador</button>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                        <input
                            type="text"
                            placeholder="Buscar projeto..."
                            className="border rounded-lg px-3 py-2 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Carregando...</div>
                    ) : error ? (
                        <div className="text-center text-red-600 py-8">{error}</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">Nenhum projeto encontrado.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-blue-50">
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Título</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Descrição</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(project => (
                                        <tr key={project.id} className="border-b hover:bg-blue-50/50">
                                            <td className="px-4 py-2 font-medium">
                                                <Link to={`/projects/${project.id}`} className="text-blue-700 hover:underline">
                                                    {project.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2 text-gray-600">{project.description || 'Sem descrição'}</td>
                                            <td className="px-4 py-2">
                                                {project.status === 'CONCLUIDO' ? (
                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Concluído</span>
                                                ) : project.status === 'EM_ANDAMENTO' ? (
                                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Em andamento</span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 flex gap-2">
                                                <Link to={`/projects/${project.id}/edit`} className="p-2 rounded text-blue-600" title="Editar">
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    className="p-2 rounded text-orange-600"
                                                    title="Remover"
                                                    onClick={() => { setProjectToDelete(project); setModalOpen(true); }}
                                                >
                                                    <FaTrash />
                                                </button>
                                                <ConfirmModal
                                                    open={modalOpen}
                                                    onConfirm={handleDeleteProject}
                                                    onCancel={() => { setModalOpen(false); setProjectToDelete(null); }}
                                                    projectName={projectToDelete?.name || ''}
                                                />
                                                {deleteSuccess && (
                                                    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
                                                        Projeto removido com sucesso!
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
