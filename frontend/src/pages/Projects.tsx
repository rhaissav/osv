import { useEffect, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { deleteProject } from '../api/project';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Project {
    id: string;
    title: string;
    description?: string;
    role?: 'OWNER' | 'MEMBER';
    status?: string;
    members: Member[];
}

interface Member {
    id: string;
    name?: string;
    email: string;
    role: 'OWNER' | 'MEMBER';
}

export default function Projects() {
    const [modalOpen, setModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [meusProjetos, setMeusProjetos] = useState<Project[]>([]);
    const [colaboradorProjetos, setColaboradorProjetos] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState<'meus' | 'colaborador'>('meus');
    const [search, setSearch] = useState('');
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/projects')
            .then(res => {
                console.log('Projetos recebidos:', res.data);
                setMeusProjetos(Array.isArray(res.data?.meusProjetos) ? res.data.meusProjetos : []);
                setColaboradorProjetos(Array.isArray(res.data?.colaboradorProjetos) ? res.data.colaboradorProjetos : []);
            })
            .catch(() => setError('Erro ao carregar projetos'))
            .finally(() => setLoading(false));
    }, []);

    const handleDeleteProject = async () => {
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
    };

    const projetosAtuais = tab === 'meus' ? meusProjetos : colaboradorProjetos;
    const filtered = projetosAtuais.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
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
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(project => (
                                        <>
                                            <tr key={project.id} className="border-b hover:bg-blue-50/50">
                                                <td className="px-4 py-2 font-medium flex items-center gap-2">
                                                    <Link to={`/projects/${project.id}`} className="text-blue-700 hover:underline">
                                                        {project.title}
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
                                                <td className="px-4 py-2 flex gap-2 items-center">
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
                                                        projectName={projectToDelete?.title || ''}
                                                    />
                                                    {deleteSuccess && (
                                                        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
                                                            Projeto removido com sucesso!
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    <button
                                                        className="p-2 rounded text-gray-500 hover:text-blue-600 focus:outline-none"
                                                        title={expandedProjectId === project.id ? 'Recolher membros' : 'Exibir membros'}
                                                        onClick={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                                                    >
                                                        {expandedProjectId === project.id ? <FaChevronUp /> : <FaChevronDown />}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedProjectId === project.id && Array.isArray(project.members) && project.members.length > 0 && (
                                                <tr>
                                                    <td colSpan={5} className="bg-blue-50/50 px-6 py-3">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex font-semibold text-xs text-gray-700 mb-1">
                                                                <div className={project.role === 'OWNER' ? 'w-1/4' : 'w-1/3'}>Usuário</div>
                                                                <div className={project.role === 'OWNER' ? 'w-1/4' : 'w-1/3'}>Email</div>
                                                                <div className={project.role === 'OWNER' ? 'w-1/4' : 'w-1/3'}>Categoria</div>
                                                                {project.role === 'OWNER' && <div className="w-1/4">Ação</div>}
                                                            </div>
                                                            {(project.members as Member[]).map((m) => {
                                                                return (
                                                                    <div key={m.id} className={`flex items-center text-xs py-1 border-b last:border-b-0 ${project.role === 'OWNER' ? '' : ''}`}>
                                                                        <div className={project.role === 'OWNER' ? 'w-1/4 font-medium' : 'w-1/3 font-medium'}>{m.name || '(sem nome)'}</div>
                                                                        <div className={project.role === 'OWNER' ? 'w-1/4 text-gray-600' : 'w-1/3 text-gray-600'}>{m.email}</div>
                                                                        <div className={project.role === 'OWNER' ? 'w-1/4' : 'w-1/3'}>
                                                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${m.role === 'OWNER' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>{m.role === 'OWNER' ? 'Proprietário' : 'Colaborador'}</span>
                                                                        </div>
                                                                        {project.role === 'OWNER' && (
                                                                            <div className="w-1/4">
                                                                                {m.role !== 'OWNER' && (
                                                                                    <button
                                                                                        className="p-1 rounded text-orange-600 hover:bg-orange-100 transition"
                                                                                        title="Remover colaborador"
                                                                                        onClick={() => {
                                                                                            setCollabToRemove({ project, member: m });
                                                                                            setCollabModalOpen(true);
                                                                                        }}
                                                                                    >
                                                                                        <FaTrash />
                                                                                    </button>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
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
