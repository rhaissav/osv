import React from 'react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
}
export const Section: React.FC<SectionProps> = ({ title, children }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-neutral-900 dark:text-neutral-100`}>
            {title}
        </h3>
        {children}
    </div>
);

interface FormulaProps {
    label: string;
    formula: string;
    labelColor: string;
    formulaColor: string;
}
export const Formula: React.FC<FormulaProps> = ({ label, formula, labelColor, formulaColor }) => {
    const containerClasses = 'font-mono text-sm py-1';
    return (
        <div className={containerClasses}>
            <span className={`font-mono text-base font-semibold ${labelColor}`}>{label}</span>
            <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400 ml-2">
                = <span className={`${formulaColor}`}>{'{ '}{formula}{' }'}</span>
            </span>
        </div>
    );
};


// Tipos importados de ProjectCreate.tsx
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
interface RelationModel {
    id: string;
    type: 'inheritance' | 'association' | 'aggregation';
    from: string;
    to: string;
    label: string;
}
interface Member {
    id: string;
    name?: string;
    email: string;
    role: 'OWNER' | 'MEMBER';
}

interface ProjectModel {
    id?: string;
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    structure: {
        name: string;
        modules: ModuleModel[];
        relations: RelationModel[];
        objects?: number;
    };
    status: 'EM_ANDAMENTO' | 'CONCLUIDO';
    role?: 'OWNER' | 'MEMBER';
    members?: Member[];
}

type RelationTypeKey = 'inheritance' | 'association' | 'aggregation';

const relationMeta: Record<RelationTypeKey, { title: string, formula: string, desc: string, color: string, icon?: React.ElementType }> = {
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

const StatusOptions: Record<'EM_ANDAMENTO' | 'CONCLUIDO', { label: string, color: string }> = {
    EM_ANDAMENTO: { label: 'Em Andamento', color: 'orange' },
    CONCLUIDO: { label: 'Concluído', color: 'emerald' },
};

interface SetTheoryViewProps {
    project: ProjectModel;
    onUpdate: (newProject: ProjectModel) => void;
}

const SetTheoryView: React.FC<SetTheoryViewProps> = ({ project, onUpdate }) => {
    const [objects, setObjects] = React.useState<number>(
        typeof project.structure.objects === 'number' ? project.structure.objects : 0
    );
    const [editingObjects, setEditingObjects] = React.useState(false);
    const [editValue, setEditValue] = React.useState(objects);

    React.useEffect(() => {
        setObjects(typeof project.structure.objects === 'number' ? project.structure.objects : 0);
    }, [project.structure.objects]);

    const handleEditClick = () => {
        setEditValue(objects);
        setEditingObjects(true);
    };
    const handleEditSave = () => {
        setObjects(editValue);
        setEditingObjects(false);
        const newProject = structuredClone(project);
        newProject.structure.objects = editValue;
        onUpdate(newProject);
    };
    const handleEditCancel = () => {
        setEditingObjects(false);
    };

    const allClasses = (project.structure?.modules ?? []).flatMap(m =>
        (m.packages ?? []).flatMap(p =>
            (p.classes ?? [])
        )
    );

    const classTypeMeta: Record<'concrete' | 'abstract' | 'interface', { label: string, color: string }> = {
        concrete: { label: 'Concreta', color: 'emerald' },
        abstract: { label: 'Abstrata', color: 'orange' },
        interface: { label: 'Interface', color: 'blue' },
    };
    const relationCounts = (project.structure?.relations ?? []).reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const RelationTypesForView = [
        { value: 'inheritance', label: 'Herança (R)', color: 'blue' },
        { value: 'association', label: 'Associação (R)', color: 'emerald' },
        { value: 'aggregation', label: 'Agregação (R)', color: 'orange' },
    ];

    const currentStatus = StatusOptions[project.status];

    const handleStatusChange = (newStatus: 'EM_ANDAMENTO' | 'CONCLUIDO') => {
        const newProject = structuredClone(project);
        newProject.status = newStatus;
        onUpdate(newProject);
    };

    // Formata a data de updatedAt se existir
    const updatedAt = project.updatedAt ? new Date(project.updatedAt) : null;

    return (
        <div className="space-y-10">
            <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
                <div className="mb-6 border-b border-neutral-100 dark:border-neutral-700 pb-4">
                    {/* Primeira linha: título e status */}
                    <div className="flex flex-row items-center justify-between gap-4 mb-1">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Representação - Contagem</h3>
                        <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(e.target.value as 'EM_ANDAMENTO' | 'CONCLUIDO')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold uppercase transition-colors appearance-none cursor-pointer border border-neutral-300 dark:border-neutral-700
                        text-${currentStatus.color}-700 bg-${currentStatus.color}-50 dark:text-${currentStatus.color}-300 dark:bg-${currentStatus.color}-900/40`}
                        >
                            {Object.keys(StatusOptions).map(key => {
                                const status = StatusOptions[key as keyof typeof StatusOptions];
                                return <option key={key} value={key}>{status.label}</option>;
                            })}
                        </select>
                    </div>
                    {/* Segunda linha: nome do projeto e última atualização */}
                    <div className="flex flex-row items-center justify-between gap-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">{project.title}</p>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">
                            Última atualização: {updatedAt ? `${updatedAt.toLocaleDateString()} ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                        </span>
                    </div>
                </div>
                <h3 className="col-span-2 sm:col-span-3 md:col-span-6 text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Visão Estática</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {[
                        { label: 'Módulos (M)', value: (project.structure?.modules ?? []).length },
                        { label: 'Pacotes (P)', value: (project.structure?.modules ?? []).reduce((a: number, m: ModuleModel) => a + ((m.packages ?? []).length), 0) },
                        { label: 'Classes (C)', value: allClasses.length },
                        ...RelationTypesForView.map(stat => ({
                            label: stat.label,
                            value: relationCounts[stat.value] || 0,
                        }))
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 transition hover:bg-neutral-100 dark:hover:bg-neutral-700`}
                        >
                            <div className={`text-xl font-bold text-neutral-900 dark:text-neutral-100`}>
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 text-center leading-tight">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Visão Dinâmica */}
                <h3 className="col-span-2 sm:col-span-3 md:col-span-6 text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 mt-10">Visão Dinâmica</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 col-span-2 sm:col-span-3 md:col-span-6">
                        {editingObjects ? (
                            <div className="flex flex-row items-center gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    value={editValue}
                                    onChange={e => setEditValue(parseInt(e.target.value) || 0)}
                                    className="w-20 text-center py-1 px-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                                />
                                <button onClick={handleEditSave} className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Salvar</button>
                                <button onClick={handleEditCancel} className="px-3 py-1 rounded bg-neutral-300 text-neutral-700 text-xs font-semibold hover:bg-neutral-400">Cancelar</button>
                            </div>
                        ) : (
                            <div className="flex flex-row items-center gap-2">
                                <div className="w-20 text-center py-1 px-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {typeof objects === 'number' ? objects : 0}
                                </div>
                                <button onClick={handleEditClick} className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">Editar</button>
                            </div>
                        )}
                        <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 text-center leading-tight mt-1">
                            Objetos (O)
                        </div>
                    </div>
                </div>

            </div>
            <Section title="Módulos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(project.structure?.modules ?? []).map(mod => {
                        const packageNames = (mod.packages ?? []).map(p => (p?.name ?? '').replace(/\s/g, '_'));
                        return (
                            <Formula
                                key={mod.id}
                                label={`${(mod?.name ?? '').replace(/\s/g, '_')}`}
                                formula={packageNames.join(', ') || '∅'}
                                labelColor="text-neutral-600 dark:text-neutral-400"
                                formulaColor="text-neutral-600 dark:text-neutral-400"
                            />
                        );
                    })}
                </div>
            </Section>
            <Section title="Pacotes">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(project.structure?.modules ?? []).flatMap(mod => (mod.packages ?? []).map(pkg => {
                        const classNames = (pkg.classes ?? []).map(c => (c?.name ?? '').replace(/\s/g, '_'));
                        return (
                            <Formula
                                key={pkg.id}
                                label={`${(pkg?.name ?? '').replace(/\s/g, '_')}`}
                                formula={classNames.join(', ') || '∅'}
                                labelColor="text-neutral-600 dark:text-neutral-400"
                                formulaColor="text-neutral-600 dark:text-neutral-400"
                            />
                        );
                    }))}
                </div>
            </Section>
            <Section title="Classes">
                <div className="grid grid-cols-1 gap-6">
                    {(allClasses ?? []).map(cls => (
                        <div key={cls.id || cls.name} className="p-5 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
                            <div className="flex items-center gap-2 font-mono border-b border-neutral-100 dark:border-neutral-600 pb-2 mb-2">
                                <span className="text-neutral-600 dark:text-neutral-400 font-semibold text-xl">{cls.name.replace(/\s/g, '_')} = <span className="text-neutral-600 dark:text-neutral-400">{'{ '}D, F{' }'}</span></span>
                                <span className={`text-xs ml-auto px-2 py-0.5 rounded-full border font-normal bg-${classTypeMeta[cls.type].color}-100 border-${classTypeMeta[cls.type].color}-300 text-${classTypeMeta[cls.type].color}-700 dark:bg-${classTypeMeta[cls.type].color}-700 dark:border-${classTypeMeta[cls.type].color}-600 dark:text-white`}>
                                    {classTypeMeta[cls.type].label}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-2">
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">D (Atributos) =</p>
                                    <div className="font-mono text-base text-neutral-800 dark:text-neutral-100 font-semibold break-words">
                                        {'{'}{(cls.attributes ?? []).join(', ') || '∅'}{' }'}
                                    </div>
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">F (Métodos) =</p>
                                    <div className="font-mono text-base text-neutral-800 dark:text-neutral-100 font-semibold break-words">
                                        {'{'}{(cls.methods ?? []).join(', ') || '∅'}{' }'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
            {(project.structure?.relations?.length ?? 0) > 0 && (
                <Section title="Relações (R)">
                    <div className="space-y-6">
                        {(['inheritance', 'association', 'aggregation'] as RelationTypeKey[]).map(typeKey => {
                            const rels = project.structure.relations.filter(r => r.type === typeKey);
                            if (rels.length === 0) return null;
                            const meta = relationMeta[typeKey];
                            const dynamicColorClasses = {
                                blue: { text: 'text-blue-600', text700: 'text-blue-700', bg100: 'bg-blue-100' },
                                emerald: { text: 'text-emerald-600', text700: 'text-emerald-700', bg100: 'bg-emerald-100' },
                                orange: { text: 'text-orange-600', text700: 'text-orange-700', bg100: 'bg-orange-100' },
                            };
                            const colorSet = dynamicColorClasses[meta.color as keyof typeof dynamicColorClasses] || dynamicColorClasses.blue;
                            const textColor = colorSet.text;
                            return (
                                <div key={typeKey} className="p-5 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`font-semibold text-lg ${textColor}`}>{meta.title.split(' ')[0]}</span>
                                    </div>
                                    <div className="space-y-1">
                                        {rels.map(rel => {
                                            const fromCls = allClasses.find(c => c.id === rel.from);
                                            const toCls = allClasses.find(c => c.id === rel.to);
                                            return (
                                                <div key={rel.id} className="font-mono text-sm">
                                                    <span className="text-neutral-600 dark:text-neutral-400">
                                                        = {'{'} <span className="text-neutral-900 dark:text-neutral-100">
                                                            ({fromCls?.name.replace(/\s/g, '_') ?? '?'}, {toCls?.name.replace(/\s/g, '_') ?? '?'} )
                                                        </span> {'}'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            )}
            {(project.structure?.modules?.length ?? 0) === 0 && (
                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-12 text-center">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Modelo Vazio</h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">Crie seu primeiro Módulo no painel lateral para começar.</p>
                    <div className="text-base text-neutral-500 dark:text-neutral-400 font-mono px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg inline-block border border-neutral-300">
                        M = {'{∅}'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SetTheoryView;
