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
interface ProjectModel {
    name: string;
    status: 'development' | 'concluded';
    modules: ModuleModel[];
    relations: RelationModel[];
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

const StatusOptions: Record<'development' | 'concluded', { label: string, color: string }> = {
    development: { label: 'Em Andamento', color: 'orange' },
    concluded: { label: 'Concluído', color: 'emerald' },
};

interface SetTheoryViewProps {
    project: ProjectModel;
    onUpdate: (newProject: ProjectModel) => void;
}

const SetTheoryView: React.FC<SetTheoryViewProps> = ({ project, onUpdate }) => {
    const allClasses = project.modules.flatMap(m => m.packages.flatMap(p => p.classes));
    const relationCounts = project.relations.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const RelationTypesForView = [
        { value: 'inheritance', label: 'Herança (R)', color: 'blue' },
        { value: 'association', label: 'Associação (R)', color: 'emerald' },
        { value: 'aggregation', label: 'Agregação (R)', color: 'orange' },
    ];

    const currentStatus = StatusOptions[project.status];

    const handleStatusChange = (newStatus: 'development' | 'concluded') => {
        const newProject = structuredClone(project);
        newProject.status = newStatus;
        onUpdate(newProject);
    };

    return (
        <div className="space-y-10">
            <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
                <div className="mb-6 border-b border-neutral-100 dark:border-neutral-700 pb-4">
                    {/* Primeira linha: título e status */}
                    <div className="flex flex-row items-center justify-between gap-4 mb-1">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Representação - Contagem</h3>
                        <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(e.target.value as 'development' | 'concluded')}
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
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">{project.name}</p>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400 font-mono">Última atualização: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {[
                        { label: 'Módulos (M)', value: project.modules.length, color: 'blue' },
                        { label: 'Pacotes (P)', value: project.modules.reduce((a, m) => a + m.packages.length, 0), color: 'purple' },
                        { label: 'Classes (C)', value: allClasses.length, color: 'emerald' },
                        ...RelationTypesForView.map(stat => ({
                            label: stat.label,
                            value: relationCounts[stat.value] || 0,
                            color: stat.color,
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
            </div>
            <Section title="Módulos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.modules.map(mod => {
                        const packageNames = mod.packages.map(p => p.name.replace(/\s/g, '_'));
                        return (
                            <Formula
                                key={mod.id}
                                label={`M_${mod.name.replace(/\s/g, '_')}`}
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
                    {project.modules.flatMap(mod => mod.packages.map(pkg => {
                        const classNames = pkg.classes.map(c => c.name.replace(/\s/g, '_'));
                        return (
                            <Formula
                                key={pkg.id}
                                label={`P_${pkg.name.replace(/\s/g, '_')}`}
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
                    {allClasses.map(cls => (
                        <div key={cls.id} className="p-5 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3">
                            <div className="flex items-center gap-2 font-mono border-b border-neutral-100 dark:border-neutral-600 pb-2 mb-2">
                                <span className="text-neutral-600 dark:text-neutral-400 font-semibold text-xl">C_{cls.name.replace(/\s/g, '_')} = <span className="text-neutral-600 dark:text-neutral-400">{'{ '}D, F{' }'}</span></span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-auto px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded-full border border-neutral-300 dark:border-neutral-600 font-normal">
                                    {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ml-2">
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">D (Atributos) =</p>
                                    <div className="font-mono text-base text-neutral-800 dark:text-neutral-100 font-semibold break-words">
                                        {'{'}{cls.attributes.join(', ') || '∅'}{'}'}
                                    </div>
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">F (Métodos) =</p>
                                    <div className="font-mono text-base text-neutral-800 dark:text-neutral-100 font-semibold break-words">
                                        {'{'}{cls.methods.join(', ') || '∅'}{'}'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
            {project.relations.length > 0 && (
                <Section title="Relações (R)">
                    <div className="space-y-4">
                        {project.relations.map(rel => {
                            const fromCls = allClasses.find(c => c.id === rel.from);
                            const toCls = allClasses.find(c => c.id === rel.to);
                            const typeKey = rel.type as RelationTypeKey;
                            const meta = relationMeta[typeKey] || { color: 'gray', title: '', formula: '', desc: '' };
                            const dynamicColorClasses = {
                                blue: { text: 'text-blue-600', text700: 'text-blue-700', bg100: 'bg-blue-100' },
                                emerald: { text: 'text-emerald-600', text700: 'text-emerald-700', bg100: 'bg-emerald-100' },
                                orange: { text: 'text-orange-600', text700: 'text-orange-700', bg100: 'bg-orange-100' },
                            };
                            const colorSet = dynamicColorClasses[meta.color as keyof typeof dynamicColorClasses] || dynamicColorClasses.blue;
                            const textColor = colorSet.text;
                            return (
                                <div key={rel.id} className="font-mono text-sm py-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-semibold ${textColor}`}>{rel.label}</span>
                                        <span className="text-neutral-600 dark:text-neutral-400 ml-2">
                                            = {'{'} <span className="text-neutral-900 dark:text-neutral-100">
                                                (C_{fromCls?.name.replace(/\s/g, '_') ?? '?'}, C_{toCls?.name.replace(/\s/g, '_') ?? '?'})
                                            </span> {'}'}
                                        </span>
                                        <span className={`ml-4 text-xs px-2 py-1 rounded-full font-bold uppercase ${colorSet.bg100} ${colorSet.text700} border border-neutral-300`}>
                                            {rel.type}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            )}
            {project.modules.length === 0 && (
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
