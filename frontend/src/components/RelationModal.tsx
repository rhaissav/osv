import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

interface RelationModel {
    id: string;
    type: 'inheritance' | 'association' | 'aggregation';
    from: string;
    to: string;
    label: string;
}
interface ClassModel {
    id: string;
    name: string;
    type: 'concrete' | 'abstract' | 'interface';
    attributes: string[];
    methods: string[];
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
interface ProjectModel {
    name: string;
    status: 'development' | 'concluded';
    modules: ModuleModel[];
    relations: RelationModel[];
    updatedAt?: string;
}

interface RelationModalProps {
    project: ProjectModel;
    onClose: () => void;
    onUpdate: (newProject: ProjectModel) => void;
    allClasses: { id: string; label: string; name: string }[];
}

const relationMeta = {
    inheritance: {
        title: 'Herança (R_I)',
        formula: '(x, y) ∈ R_I ∧ (y, z) ∈ R_I ⇒ (x, z) ∈ R_I',
        color: 'blue',
        desc: 'Relação transitiva — se uma classe herda de outra, herda também de suas ancestrais.',
    },
    association: {
        title: 'Associação (R_AS)',
        formula: '(x, y) ∈ R_AS ⇒ (y, x) ∈ R_AS',
        color: 'emerald',
        desc: 'Relação simétrica — ambas as classes se associam mutuamente.',
    },
    aggregation: {
        title: 'Agregação (R_AG)',
        formula: '(x, y) ∈ R_AG',
        color: 'orange',
        desc: 'Relação todo-parte — define dependência estrutural sem simetria.',
    },
};

type RelationTypeKey = 'inheritance' | 'association' | 'aggregation';

const RelationModal: React.FC<RelationModalProps> = ({ project, onClose, onUpdate, allClasses }) => {
    const [relationType, setRelationType] = useState<RelationTypeKey>('inheritance');
    const [fromClass, setFromClass] = useState('');
    const [toClass, setToClass] = useState('');

    const dynamicColorClasses = {
        blue: { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700', text: 'text-blue-600', bg50: 'bg-blue-50', border: 'border-blue-500', text700: 'text-blue-700', border200: 'border-blue-200', bg100: 'bg-blue-100' },
        emerald: { bg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-700', text: 'text-emerald-600', bg50: 'bg-emerald-50', border: 'border-emerald-500', text700: 'text-emerald-700', border200: 'border-emerald-200', bg100: 'bg-emerald-100' },
        orange: { bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700', text: 'text-orange-600', bg50: 'bg-orange-50', border: 'border-orange-500', text700: 'text-orange-700', border200: 'border-orange-200', bg100: 'bg-orange-100' },
    };

    const handleAddRelation = () => {
        if (!fromClass || !toClass || fromClass === toClass) return;
        const newProject = structuredClone(project) as ProjectModel;
        const meta = relationMeta[relationType];
        newProject.relations.push({
            id: `r${Date.now()}`,
            type: relationType,
            from: fromClass,
            to: toClass,
            label: meta.title.split(' ')[0],
        });
        onUpdate(newProject);
        setFromClass('');
        setToClass('');
    };

    const deleteRelation = (id: string) => {
        const newProject = structuredClone(project) as ProjectModel;
        newProject.relations = newProject.relations.filter(r => r.id !== id);
        onUpdate(newProject);
    };

    const meta = relationMeta[relationType];
    const colorSet = dynamicColorClasses[meta.color as keyof typeof dynamicColorClasses] || dynamicColorClasses.blue;

    return (
        <div className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end p-3">
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition">
                        <X size={18} />
                    </button>
                </div>
                <div className="px-6 pb-6 space-y-6">
                    <div className="border-b border-neutral-200 dark:border-neutral-700 pb-3">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                            Gerenciar Relações entre Classes
                        </h3>
                    </div>
                    <div className={`rounded-xl border-l-4 ${colorSet.border} ${colorSet.bg50} dark:bg-${meta.color}-900/20 p-5`}>
                        <h4 className={`font-semibold ${colorSet.text700} dark:text-${meta.color}-300 mb-1`}>
                            {meta.title}
                        </h4>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">{meta.desc}</p>
                        <code className="block font-mono text-sm bg-white/70 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-700">
                            {meta.formula}
                        </code>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">Nova Relação</h4>
                        <div className="grid sm:grid-cols-3 gap-3">
                            <select
                                value={relationType}
                                onChange={(e) => setRelationType(e.target.value as RelationTypeKey)}
                                className="px-3 py-2 border border-neutral-300 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 focus:ring-2 focus:ring-blue-400 text-sm"
                            >
                                {Object.keys(relationMeta).map(key => {
                                    const r = relationMeta[key as RelationTypeKey];
                                    return <option key={key} value={key}>{r.title}</option>
                                })}
                            </select>
                            <select
                                value={fromClass}
                                onChange={(e) => setFromClass(e.target.value)}
                                className="px-3 py-2 border border-neutral-300 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 focus:ring-2 focus:ring-blue-400 text-sm"
                            >
                                <option value="">Classe "De" (Origem)</option>
                                {allClasses.map((cls) => (
                                    <option key={cls.id} value={cls.id}>{cls.label}</option>
                                ))}
                            </select>
                            <select
                                value={toClass}
                                onChange={(e) => setToClass(e.target.value)}
                                className="px-3 py-2 border border-neutral-300 rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 focus:ring-2 focus:ring-blue-400 text-sm"
                            >
                                <option value="">Classe "Para" (Destino)</option>
                                {allClasses.map((cls) => (
                                    <option key={cls.id} value={cls.id}>{cls.label}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAddRelation}
                            disabled={!fromClass || !toClass || fromClass === toClass}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition text-sm flex items-center justify-center gap-2
              ${!fromClass || !toClass || fromClass === toClass
                                    ? 'bg-neutral-400 dark:bg-neutral-600 cursor-not-allowed'
                                    : `${colorSet.bg} ${colorSet.hoverBg}`}`}
                        >
                            Adicionar Relação
                        </button>
                    </div>
                    <div>
                        <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                            Relações Existentes ({project.relations.length})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {project.relations.length === 0 ? (
                                <p className="text-neutral-500 dark:text-neutral-400 text-sm text-center py-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">Nenhuma relação definida.</p>
                            ) : (
                                project.relations.map((rel) => {
                                    const config = relationMeta[rel.type as RelationTypeKey];
                                    const dynamicClasses = dynamicColorClasses[config.color as keyof typeof dynamicColorClasses] || dynamicColorClasses.blue;
                                    const From = allClasses.find((c) => c.id === rel.from);
                                    const To = allClasses.find((c) => c.id === rel.to);
                                    const fromName = From?.name.replace(/\s/g, '_') ?? '?';
                                    const toName = To?.name.replace(/\s/g, '_') ?? '?';
                                    return (
                                        <div key={rel.id} className={`flex items-center justify-between px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 ${dynamicClasses.bg50} dark:bg-${config.color}-900/20`}>
                                            <div className="font-mono text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                                <span className={`font-semibold ${dynamicClasses.text}`}>
                                                    {rel.label}
                                                </span>
                                                <span className="text-neutral-600 dark:text-neutral-400 ml-2">
                                                    = {'{'} <span className="text-neutral-900 dark:text-neutral-100">
                                                        (C_{fromName}, C_{toName})
                                                    </span> {'}'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => deleteRelation(rel.id)}
                                                className="text-orange-500 hover:text-orange-600 transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelationModal;
