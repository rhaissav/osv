import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import ElementModalForm from '../components/ElementModalForm';
import RelationModal from '../components/RelationModal';
import SetTheoryView from '../components/SetTheoryView';
import { useParams } from 'react-router-dom';
import { createProject, updateProject, getProject, addProjectMember } from '../api/project';
import Button from '../components/Button';
import {
    Plus,
    Trash2,
    ChevronDown,
    ChevronRight,
    Search,
    Edit2,
    Package as PackageIcon,
    Folder as FolderIcon,
    Box as BoxIcon,
    Triangle,
    Diamond,
} from 'lucide-react';


// Estruturas do Modelo de Projeto (Mantidas em string[] para o método final)
interface ClassModel {
    id: string;
    name: string;
    type: 'concrete' | 'abstract' | 'interface';
    attributes: string[];
    methods: string[]; // Final format: 'name(p1:T1, p2:T2):R'
}
interface PackageModel {
    id: string;
    name: string;
    classes: ClassModel[];
}
interface ModuleModel {
    id: string;
    name: string;
    packages: PackageModel[];
}
interface RelationModel {
    id: string;
    type: 'inheritance' | 'association' | 'aggregation';
    from: string;
    to: string;
    label: string;
}
interface ProjectStructure {
    name: string;
    modules: ModuleModel[];
    relations: RelationModel[];
}

interface ProjectModel extends ProjectStructure {
    status: 'development' | 'concluded';
}


// --- Componente Principal --//
const OOSetModelingTool = () => {
    const { id } = useParams();
    const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
    const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showRelationModal, setShowRelationModal] = useState(false);
    const [modalMode, setModalMode] = useState<{
        type: 'module' | 'package' | 'class';
        parentId: string | null;
        parentName: string;
        editMode: boolean;
        editId: string | null;
    }>({
        type: 'module',
        parentId: null,
        parentName: '',
        editMode: false,
        editId: null
    });

    // Novos estados para integração
    const [project, setProject] = useState<ProjectModel>({
        name: '',
        status: 'development',
        modules: [],
        relations: [],
    });
    const [projectId, setProjectId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    // Estado para modal de colaborador
    const [showAddCollaborator, setShowAddCollaborator] = useState(false);
    const [collabEmail, setCollabEmail] = useState('');
    const [collabError, setCollabError] = useState('');
    const [collabSuccess, setCollabSuccess] = useState('');
    const [collabLoading, setCollabLoading] = useState(false);

    // Carregar dados do projeto se estiver em modo edição
    useEffect(() => {
        if (id) {
            setLoading(true);
            getProject(id)
                .then((data) => {
                    setProjectId(data.id);
                    setTitle(data.title || data.name || '');
                    setDescription(data.description || '');
                    let status: 'development' | 'concluded' = 'development';
                    if (data.status === 'CONCLUIDO') status = 'concluded';
                    if (data.status === 'EM_ANDAMENTO') status = 'development';
                    const structure = data.structure || data;
                    setProject({
                        name: structure.name || data.title || '',
                        status,
                        modules: structure.modules || [],
                        relations: structure.relations || [],
                    });
                })
                .catch(() => setError('Erro ao carregar projeto'))
                .finally(() => setLoading(false));
        }
    }, [id]);


    const allClasses = project.modules.flatMap(mod => mod.packages.flatMap(pkg => pkg.classes.map(cls => ({ id: cls.id, label: `${mod.name}/${pkg.name}/${cls.name}`, name: cls.name }))));

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };
    const togglePackage = (packageId: string) => {
        setExpandedPackages(prev => ({ ...prev, [packageId]: !prev[packageId] }));
    };
    const openModal = (type: 'module' | 'package' | 'class', parentId: string | null = null, parentName: string = '', editMode = false, editId: string | null = null) => {
        setModalMode({ type, parentId, parentName, editMode, editId });
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const deleteElement = (type: 'module' | 'package' | 'class', id: string) => {
        if (!window.confirm(`Tem certeza que deseja remover este ${type}? Isso pode afetar relações.`)) return;
        const newProject = structuredClone(project) as ProjectModel;
        if (type === 'module') {
            newProject.modules = newProject.modules.filter(m => m.id !== id);
        } else if (type === 'package') {
            newProject.modules.forEach(mod => {
                mod.packages = mod.packages.filter(p => p.id !== id);
            });
        } else if (type === 'class') {
            newProject.modules.forEach(mod => {
                mod.packages.forEach(pkg => {
                    pkg.classes = pkg.classes.filter(c => c.id !== id);
                });
            });
            newProject.relations = newProject.relations.filter(r => r.from !== id && r.to !== id);
        }
        setProject(newProject);
    };

    const filteredModules = project.modules.filter(mod => {
        if (!searchTerm.trim()) return true;
        const low = searchTerm.toLowerCase();
        if (mod.name.toLowerCase().includes(low)) return true;
        return mod.packages.some(pkg => {
            if (pkg.name.toLowerCase().includes(low)) return true;
            return pkg.classes.some(c => c.name.toLowerCase().includes(low));
        });
    });

    // Função para obter o ícone de tipo de elemento na árvore
    const getIconForTree = (type: 'module' | 'package' | 'class', classType?: 'concrete' | 'abstract' | 'interface') => {
        if (type === 'module') return <PackageIcon size={16} className="text-blue-600 dark:text-blue-400" />;
        if (type === 'package') return <FolderIcon size={16} className="text-purple-600 dark:text-purple-400" />;
        if (type === 'class') {
            // Pequena constante local para ícones de classe
            const classTypeIcons: Record<string, { icon: React.ElementType; color: string }> = {
                concrete: { icon: BoxIcon, color: 'emerald' },
                abstract: { icon: Triangle, color: 'orange' },
                interface: { icon: Diamond, color: 'cyan' },
            };
            const config = classType ? classTypeIcons[classType] : undefined;
            if (config) {
                const Icon = config.icon;
                return <Icon size={14} className={`text-${config.color}-600 dark:text-${config.color}-400`} />;
            }
            return <BoxIcon size={14} className="text-neutral-500 dark:text-neutral-400" />;
        }
        return null;
    };

    const renderTree = () => (
        <div className="space-y-2 text-sm">
            {filteredModules.map(mod => (
                <div key={mod.id} className="space-y-1">
                    <div className="group flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition p-2">
                        <div onClick={() => toggleModule(mod.id)} className="flex-1 flex items-center gap-2 cursor-pointer">
                            {expandedModules[mod.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            {getIconForTree('module')} {/* Ícone de Módulo */}
                            <span className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{mod.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition pr-2">
                            <button onClick={() => openModal('package', mod.id, mod.name)} className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full transition text-xs font-medium" title="Adicionar Pacote"><Plus size={16} /></button>
                            <button onClick={() => openModal('module', null, '', true, mod.id)} className="p-1.5 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition" title="Editar Módulo"><Edit2 size={16} /></button>
                            <button onClick={() => deleteElement('module', mod.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-full transition" title="Remover Módulo"><Trash2 size={16} /></button>
                        </div>
                    </div>
                    {expandedModules[mod.id] && (
                        <div className="ml-5 border-l border-neutral-200 dark:border-neutral-700 pl-3 space-y-1">
                            {mod.packages.map(pkg => (
                                <div key={pkg.id} className="space-y-1">
                                    <div className="group flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition p-2">
                                        <div onClick={() => togglePackage(pkg.id)} className="flex-1 flex items-center gap-2 cursor-pointer">
                                            {expandedPackages[pkg.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                            {getIconForTree('package')} {/* Ícone de Pacote */}
                                            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{pkg.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition pr-2">
                                            <button onClick={() => openModal('class', pkg.id, `${mod.name}/${pkg.name}`)} className="p-1.5 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full transition text-xs font-medium" title="Adicionar Classe"><Plus size={16} /></button>
                                            <button onClick={() => openModal('package', mod.id, mod.name, true, pkg.id)} className="p-1.5 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition" title="Editar Pacote"><Edit2 size={16} /></button>
                                            <button onClick={() => deleteElement('package', pkg.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-full transition" title="Remover Pacote"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    {expandedPackages[pkg.id] && (
                                        <div className="ml-5 border-l border-neutral-200 dark:border-neutral-700 pl-3 space-y-1">
                                            {pkg.classes.map(cls => (
                                                <div key={cls.id} className="group flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition p-2">
                                                    <div className="flex-1 flex items-center gap-2">
                                                        {getIconForTree('class', cls.type)} {/* Ícone de Classe */}
                                                        <span className={`text-sm text-neutral-700 dark:text-neutral-200 font-mono`}>{cls.name}</span>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium ml-2">({cls.type.substring(0, 3)})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition pr-2">
                                                        <button onClick={() => openModal('class', pkg.id, `${mod.name}/${pkg.name}`, true, cls.id)} className="p-1.5 text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition" title="Editar Classe"><Edit2 size={16} /></button>
                                                        <button onClick={() => deleteElement('class', cls.id)} className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/10 rounded-full transition" title="Remover Classe"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );


    // Função para salvar ou atualizar projeto
    const handleSaveProject = async () => {
        setLoading(true);
        setError('');
        try {
            if (!title.trim() || !description.trim()) {
                setError('Preencha título e descrição.');
                setLoading(false);
                return;
            }
            const backendStatus = project.status === 'development' ? 'EM_ANDAMENTO' : 'CONCLUIDO';
            const structure: ProjectStructure = {
                name: project.name,
                modules: project.modules,
                relations: project.relations
            };
            if (!projectId) {
                // Criação
                const res = await createProject({ title, description, status: backendStatus, structure });
                setProjectId(res.id);
                setSuccess(true);
            } else {
                // Atualização
                await updateProject({ id: projectId, title, description, status: backendStatus, structure });
                setSuccess(true);
            }
        } catch {
            setError('Erro ao salvar projeto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex font-sans antialiased">
            {/* Painel Esquerdo */}
            <aside className="w-full lg:w-96 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
                <div className="p-5 border-b border-neutral-200 dark:border-neutral-700">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Modelagem OO</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{title || 'Novo Projeto'}</p>
                </div>

                <div className="p-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 space-y-3">
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Título do Projeto</label>
                        <input
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Digite o título do projeto"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Descrição</label>
                        <textarea
                            className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Digite a descrição do projeto"
                        />
                    </div>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Buscar Módulos, Pacotes ou Classes..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 transition"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => openModal('module')} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                            <Plus size={16} />
                            Novo Módulo
                        </button>
                        <button onClick={() => setShowRelationModal(true)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition font-medium text-sm">
                            Relações
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 text-sm">
                    {filteredModules.length > 0 ? renderTree() : (
                        <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
                            <p>Nenhum elemento encontrado.</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Painel Direito */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                <div className="max-w-6xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Visualização (Teoria dos Conjuntos)</h2>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-1.5 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition font-medium text-xs"
                                onClick={handleSaveProject}
                                disabled={loading}
                            >
                                Salvar Projeto
                            </button>
                            <button
                                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-xs"
                                onClick={() => setShowAddCollaborator(true)}
                                type="button"
                            >
                                Adicionar colaborador
                            </button>
                            {/* Modal de adicionar colaborador */}
                            {showAddCollaborator && (
                                <Modal onClose={() => {
                                    setShowAddCollaborator(false);
                                    setCollabEmail('');
                                    setCollabError('');
                                    setCollabSuccess('');
                                }}>
                                    <div className="w-full max-w-xs mx-auto p-0 flex flex-col items-center justify-center text-center">
                                        {collabSuccess ? (
                                            <div className="flex flex-col items-center justify-center gap-2 py-6">
                                                <div className="rounded-full bg-emerald-100 p-2 flex items-center justify-center mb-1">
                                                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <h3 className="text-lg font-semibold mb-1">Colaborador adicionado!</h3>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">O usuário foi adicionado ao projeto com sucesso.</p>
                                                <Button
                                                    variant="success"
                                                    className="px-4 py-1.5 text-xs w-full"
                                                    onClick={() => {
                                                        setShowAddCollaborator(false);
                                                        setCollabEmail('');
                                                        setCollabError('');
                                                        setCollabSuccess('');
                                                    }}
                                                >
                                                    Fechar
                                                </Button>
                                            </div>
                                        ) : (
                                            <form className="flex flex-col items-center justify-center w-full gap-0 py-6" onSubmit={e => { e.preventDefault(); }}>
                                                <h3 className="text-lg font-semibold mb-3 w-full">Adicionar colaborador</h3>
                                                <label className="block text-sm font-medium mb-1 w-full text-left">E-mail do colaborador</label>
                                                <input
                                                    type="email"
                                                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 mb-1"
                                                    placeholder="email@exemplo.com"
                                                    value={collabEmail}
                                                    onChange={e => setCollabEmail(e.target.value)}
                                                    disabled={collabLoading}
                                                    autoFocus
                                                />
                                                {collabError && <div className="text-red-600 text-xs mb-1 w-full text-left">{collabError}</div>}
                                                <div className="flex flex-row gap-2 mt-3 w-full">
                                                    <Button
                                                        variant="primary"
                                                        className="flex-1 px-3 py-1.5 text-xs"
                                                        disabled={collabLoading || !collabEmail}
                                                        onClick={async () => {
                                                            setCollabError('');
                                                            setCollabSuccess('');
                                                            setCollabLoading(true);
                                                            try {
                                                                if (!projectId) {
                                                                    setCollabError('Salve o projeto antes de adicionar colaboradores.');
                                                                    setCollabLoading(false);
                                                                    return;
                                                                }
                                                                await addProjectMember(projectId, collabEmail);
                                                                setCollabSuccess('Colaborador adicionado com sucesso!');
                                                                setCollabEmail('');
                                                            } catch (err: any) {
                                                                setCollabError(err?.response?.data?.error || 'Erro ao adicionar colaborador.');
                                                            } finally {
                                                                setCollabLoading(false);
                                                            }
                                                        }}
                                                    >
                                                        {collabLoading ? 'Adicionando...' : 'Adicionar'}
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        className="flex-1 px-3 py-1.5 text-xs"
                                                        onClick={() => {
                                                            setShowAddCollaborator(false);
                                                            setCollabEmail('');
                                                            setCollabError('');
                                                            setCollabSuccess('');
                                                        }}
                                                        disabled={collabLoading}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                </Modal>
                            )}
                            <button
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-xs"
                                onClick={async () => {
                                    if (!projectId) return;
                                    try {
                                        const { exportProjectPdf } = await import('../api/project');
                                        const pdfBlob = await exportProjectPdf(projectId);
                                        const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', `project-${projectId}.pdf`);
                                        document.body.appendChild(link);
                                        link.click();
                                        link.parentNode?.removeChild(link);
                                        window.URL.revokeObjectURL(url);
                                    } catch (err) {
                                        alert('Erro ao exportar PDF');
                                    }
                                }}
                            >
                                Exportar
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                    {success && (
                        <div className="text-green-600 text-sm mt-2">Projeto salvo com sucesso!</div>
                    )}
                    <SetTheoryView project={project} onUpdate={setProject} />
                </div>
            </main>

            {showModal && (
                <Modal onClose={closeModal}>
                    <ElementModalForm initialProject={project} modalMode={modalMode} onClose={closeModal} onUpdate={setProject} />
                </Modal>
            )}
            {showRelationModal && (
                <RelationModal project={project} allClasses={allClasses} onClose={() => setShowRelationModal(false)} onUpdate={setProject} />
            )}
        </div>
    );
};

export default OOSetModelingTool;


