import React, { useState } from 'react';
import Button from '../components/Button';
import Select from '../components/Select';
import ClassForm from '../components/ClassForm';
import RelationForm from '../components/RelationForm';
import api from '../api/axios';

// Tipos OO
interface ProjetoOO {
    modules: Modulo[];
}
interface Modulo {
    name: string;
    packages: Pacote[];
}
interface Pacote {
    name: string;
    classes: Classe[];
    interfaces: InterfaceOO[];
}
interface Classe {
    name: string;
    type: 'concreta' | 'abstrata';
    attributes: string[];
    methods: string[];
    extends?: string;
    implements?: string[];
    associations?: string[];
    aggregations?: string[];
}
interface InterfaceOO {
    name: string;
    methods: string[];
}

const initialStructure: ProjetoOO = { modules: [] };

export default function ProjectCreate() {
    // Project info
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'EM_ANDAMENTO' | 'CONCLUIDO'>('EM_ANDAMENTO');
    const [structure, setStructure] = useState<ProjetoOO>(initialStructure);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [saved, setSaved] = useState(false);

    // Removido controle de step: todos os passos aparecem juntos

    // Form states
    const [modName, setModName] = useState('');
    const [pkgName, setPkgName] = useState('');

    // Helpers para selects
    const allModules = structure.modules;
    const allPkgs = allModules.flatMap(m => m.packages);
    const allClasses = allPkgs.flatMap(p => p.classes);

    // Adicionar módulo
    function addModule() {
        if (!modName.trim()) { setError('Nome do módulo obrigatório'); return; }
        if (allModules.some(m => m.name === modName.trim())) { setError('Módulo já existe'); return; }
        setStructure(s => ({ ...s, modules: [...s.modules, { name: modName.trim(), packages: [] }] }));
        setModName(''); setError('');
    }
    // Adicionar pacote
    function addPackage() {
        if (!pkgName.trim()) { setError('Nome do pacote obrigatório'); return; }
        if (allModules.length === 0) { setError('Crie um módulo antes'); return; }
        // Permite escolher o módulo para o pacote
        const mod = allModules.find(m => m.name === selectedModuleForPackage);
        if (!mod) { setError('Selecione o módulo para o pacote'); return; }
        if (mod.packages.some(p => p.name === pkgName.trim())) { setError('Pacote já existe'); return; }
        mod.packages.push({ name: pkgName.trim(), classes: [], interfaces: [] });
        setStructure(s => ({ ...s }));
        setPkgName(''); setSelectedModuleForPackage(''); setError('');
    }
    // Adicionar classe ou interface (via ClassForm)
    function handleAddClass({ name, type, attributes, methods, pkg }: { name: string; type: 'concreta' | 'abstrata' | 'interface'; attributes: string[]; methods: string[]; pkg: string }) {
        const pacote = allPkgs.find(p => p.name === pkg);
        if (!pacote) { setError('Pacote não encontrado'); return; }
        if (type === 'interface') {
            if (pacote.interfaces.some(i => i.name === name)) { setError('Interface já existe'); return; }
            pacote.interfaces.push({ name, methods });
        } else {
            if (pacote.classes.some(c => c.name === name)) { setError('Classe já existe'); return; }
            pacote.classes.push({ name, type, attributes, methods });
        }
        setStructure(s => ({ ...s }));
        setError('');
    }
    // Adicionar relacionamento (via RelationForm)
    function handleAddRelation({ type, origin, dest }: { type: string; origin: string; dest: string }) {
        const origem = allClasses.find(c => c.name === origin);
        if (!origem) { setError('Classe de origem não encontrada'); return; }
        if (type === 'heranca') origem.extends = dest;
        else if (type === 'implementacao') origem.implements = [...(origem.implements || []), dest];
        else if (type === 'associacao') origem.associations = [...(origem.associations || []), dest];
        else if (type === 'agregacao') origem.aggregations = [...(origem.aggregations || []), dest];
        setStructure(s => ({ ...s }));
        setError('');
    }

    // Salvar projeto (POST/PUT)
    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!saved) {
                await api.post('/projects', { title, description, status, structure });
            } else {
                await api.put('/projects/current', { title, description, status, structure });
            }
            setShowModal(true);
            setSaved(true);
        } catch {
            setError('Erro ao salvar projeto.');
        } finally {
            setLoading(false);
        }
    }

    // Preview visual OO
    function OOSetPreview({ structure }: { structure: ProjetoOO }) {
        return (
            <div className="space-y-4">
                {structure.modules.map((mod, mi) => (
                    <div key={mi} className="bg-white border rounded shadow p-4">
                        <div className="font-bold mb-1">Módulo {mod.name}</div>
                        <div className="bg-gray-50 rounded p-2 text-xs mb-2">{mod.name} = {'{ '}{mod.packages.map(p => p.name).join(', ')}{' }'}</div>
                        {mod.packages.map((pkg, pi) => (
                            <div key={pi} className="ml-2 mb-2">
                                <div className="font-semibold">Pacote {pkg.name}</div>
                                <div className="bg-gray-50 rounded p-2 text-xs mb-1">{pkg.name} = {'{ '}{[...pkg.classes.map(c => c.name), ...pkg.interfaces.map(i => i.name)].join(', ')}{' }'}</div>
                                {pkg.classes.map((cls, ci) => (
                                    <div key={ci} className="ml-2 mb-1">
                                        <div className="font-medium">Classe {cls.name} {cls.type === 'abstrata' && <span className="italic">(abstrata)</span>}</div>
                                        <div className="bg-gray-100 rounded p-2 text-xs">
                                            {cls.name} = {'{ '}
                                            {cls.extends && <><span className="text-blue-700">herda</span>: {cls.extends}<br /></>}
                                            {cls.implements && cls.implements.length > 0 && <><span className="text-blue-700">implementa</span>: {cls.implements.join(', ')}<br /></>}
                                            {cls.associations && cls.associations.length > 0 && <><span className="text-blue-700">associações</span>: {cls.associations.join(', ')}<br /></>}
                                            {cls.aggregations && cls.aggregations.length > 0 && <><span className="text-blue-700">agregações</span>: {cls.aggregations.join(', ')}<br /></>}
                                            {cls.attributes.length > 0 && (<><span className="text-gray-700">D</span> = {'{ '}{cls.attributes.join(', ')}{' }'}<br /></>)}
                                            {cls.methods.length > 0 && (<><span className="text-gray-700">F</span> = {'{ '}{cls.methods.join(', ')}{' }'}<br /></>)}
                                            {'}'}
                                        </div>
                                    </div>
                                ))}
                                {pkg.interfaces.map((iface, ii) => (
                                    <div key={ii} className="ml-2 mb-1">
                                        <div className="font-medium">Interface {iface.name}</div>
                                        <div className="bg-gray-100 rounded p-2 text-xs">
                                            {iface.name} = {'{ '}
                                            {iface.methods.length > 0 && (<><span className="text-gray-700">F</span> = {'{ '}{iface.methods.join(', ')}{' }'}<br /></>)}
                                            {'}'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    // Estados para selects de módulo/pacote
    const [selectedModuleForPackage, setSelectedModuleForPackage] = useState('');

    // Todos os passos exibidos juntos usando o componente Select
    function renderAllSteps() {
        return (
            <>
                {/* Passo 1: Módulo */}
                <div className="border rounded p-4 mb-4">
                    <div className="font-semibold mb-2">Passo 1: Módulo</div>
                    <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Nome do módulo" value={modName} onChange={e => setModName(e.target.value)} />
                    <Button onClick={addModule} className="w-full">Adicionar módulo</Button>
                </div>
                {/* Passo 2: Pacote */}
                <div className="border rounded p-4 mb-4">
                    <div className="font-semibold mb-2">Passo 2: Pacote</div>
                    <Select
                        label={undefined}
                        value={selectedModuleForPackage}
                        onChange={e => setSelectedModuleForPackage(e.target.value)}
                        options={[{ value: '', label: 'Selecione o módulo' }, ...allModules.map((m) => ({ value: m.name, label: m.name }))]}
                    />
                    <input className="border rounded px-2 py-1 w-full mb-2" placeholder="Nome do pacote" value={pkgName} onChange={e => setPkgName(e.target.value)} />
                    <Button onClick={addPackage} className="w-full">Adicionar pacote</Button>
                </div>
                {/* Passo 3: Classe/Interface */}
                <ClassForm allPkgs={allPkgs} onAdd={handleAddClass} />
                {/* Passo 4: Relacionamentos */}
                <RelationForm allClasses={allClasses} onAdd={handleAddRelation} />
            </>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-10">
            <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Novo Projeto</h2>
                    <Button type="submit" variant="primary" className="w-auto px-6" disabled={loading}>Salvar Projeto</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Esquerda: Wizard */}
                    <div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Título</label>
                            <input className="border rounded px-3 py-2 w-full" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Status</label>
                            <select className="border rounded px-3 py-2 w-full" value={status} onChange={e => setStatus(e.target.value as 'EM_ANDAMENTO' | 'CONCLUIDO')}>
                                <option value="EM_ANDAMENTO">Em andamento</option>
                                <option value="CONCLUIDO">Concluído</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Descrição</label>
                            <textarea className="border rounded px-3 py-2 w-full" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        {renderAllSteps()}
                        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
                    </div>
                    {/* Direita: Preview OO */}
                    <div>
                        <h3 className="font-semibold mb-2">Visualização da Estrutura OO</h3>
                        <OOSetPreview structure={structure} />
                    </div>
                </div>
            </form>
            {/* Modal de sucesso */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                        <div className="text-green-600 text-2xl mb-2">Projeto salvo!</div>
                        <Button onClick={() => setShowModal(false)} className="mt-4 w-full">OK</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
