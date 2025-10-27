import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
interface Attribute {
    name: string;
    type: string;
}
interface Parameter {
    name: string;
    type: string;
}
interface FormMethod {
    name: string;
    returnType: string;
    parameters: Parameter[];
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
    status: 'EM_ANDAMENTO' | 'CONCLUIDO';
    structure: ProjectStructure;
    role?: 'OWNER' | 'MEMBER';
    members?: Member[];
}

interface ModalFormProps {
    initialProject: ProjectModel;
    modalMode: { type: 'module' | 'package' | 'class'; parentId: string | null; parentName: string; editMode: boolean; editId: string | null };
    onClose: () => void;
    onUpdate: (newProject: ProjectModel) => void;
}


const DataTypes = ['String', 'int', 'long', 'float', 'double', 'boolean', 'char', 'Date', 'Object', 'List', 'Map', 'Set'];
const ClassTypes = [
    { value: 'concrete', label: 'Concreta', color: 'emerald' },
    { value: 'abstract', label: 'Abstrata', color: 'orange' },
    { value: 'interface', label: 'Interface', color: 'cyan' },
];


const ElementModalForm: React.FC<ModalFormProps> = ({ initialProject, modalMode, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<{
        name: string;
        classType: 'concrete' | 'abstract' | 'interface';
        attributes: Attribute[];
        methods: FormMethod[];
    }>({ name: '', classType: 'concrete', attributes: [], methods: [] });

    const [currentAttribute, setCurrentAttribute] = useState<Attribute>({ name: '', type: 'String' });
    const [currentMethod, setCurrentMethod] = useState<{
        name: string;
        returnType: string;
        tempParameters: Parameter[];
    }>({ name: '', returnType: 'void', tempParameters: [] });
    const [currentParameter, setCurrentParameter] = useState<Parameter>({ name: '', type: 'String' });

    useEffect(() => {
        if (modalMode.editMode && modalMode.editId) {
            if (modalMode.type === 'module') {
                const element = initialProject.structure.modules.find(m => m.id === modalMode.editId);
                if (element) setFormData(prev => ({ ...prev, name: element.name }));
            } else if (modalMode.type === 'package') {
                initialProject.structure.modules.forEach(mod => {
                    const pkg = mod.packages.find(p => p.id === modalMode.editId);
                    if (pkg) setFormData(prev => ({ ...prev, name: pkg.name }));
                });
            } else if (modalMode.type === 'class') {
                initialProject.structure.modules.forEach(mod => {
                    mod.packages.forEach(pkg => {
                        const cls = pkg.classes.find(c => c.id === modalMode.editId);
                        if (cls) {
                            const attrs: Attribute[] = cls.attributes.map(attr => {
                                const [name, type] = attr.split(':');
                                return { name: name || '', type: type || 'String' };
                            });
                            const meths: FormMethod[] = cls.methods.map(method => {
                                const match = method.match(/(.+)\((.*)\):(.+)/);
                                if (match) {
                                    const paramString = match[2] || '';
                                    const parsedParams: Parameter[] = paramString
                                        .split(',')
                                        .map(p => p.trim())
                                        .filter(p => p)
                                        .map(p => {
                                            const [name, type] = p.split(':');
                                            return { name: name?.trim() || 'p', type: type?.trim() || 'String' };
                                        });
                                    return {
                                        name: match[1] || '',
                                        returnType: match[3] || 'void',
                                        parameters: parsedParams
                                    };
                                }
                                return { name: method, parameters: [], returnType: 'void' };
                            });
                            setFormData({ name: cls.name, classType: cls.type, attributes: attrs, methods: meths });
                        }
                    });
                });
            }
        } else {
            setCurrentMethod({ name: '', returnType: 'void', tempParameters: [] });
            setCurrentParameter({ name: '', type: 'String' });
        }
    }, [modalMode, initialProject.structure.modules]);

    const addAttribute = () => {
        if (currentAttribute.name.trim()) {
            setFormData(prev => ({ ...prev, attributes: [...prev.attributes, { ...currentAttribute }] }));
            setCurrentAttribute({ name: '', type: 'String' });
        }
    };
    const removeAttribute = (index: number) => {
        setFormData(prev => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));
    };
    const addTempParameter = () => {
        if (currentParameter.name.trim()) {
            setCurrentMethod(prev => ({
                ...prev,
                tempParameters: [...prev.tempParameters, { ...currentParameter }]
            }));
            setCurrentParameter({ name: '', type: 'String' });
        }
    };
    const removeTempParameter = (index: number) => {
        setCurrentMethod(prev => ({
            ...prev,
            tempParameters: prev.tempParameters.filter((_, i) => i !== index)
        }));
    };
    const addMethod = () => {
        if (currentMethod.name.trim()) {
            setFormData(prev => ({
                ...prev,
                methods: [
                    ...prev.methods,
                    {
                        name: currentMethod.name,
                        returnType: currentMethod.returnType,
                        parameters: currentMethod.tempParameters
                    }
                ]
            }));
            setCurrentMethod({ name: '', returnType: 'void', tempParameters: [] });
        }
    };
    const removeMethod = (index: number) => {
        setFormData(prev => ({ ...prev, methods: prev.methods.filter((_, i) => i !== index) }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        const newProject = structuredClone(initialProject) as ProjectModel;
        if (modalMode.editMode && modalMode.editId) {
            if (modalMode.type === 'module') {
                const mod = newProject.structure.modules.find(m => m.id === modalMode.editId);
                if (mod) mod.name = formData.name;
            } else if (modalMode.type === 'package') {
                newProject.structure.modules.forEach(mod => {
                    const pkg = mod.packages.find(p => p.id === modalMode.editId);
                    if (pkg) pkg.name = formData.name;
                });
            } else if (modalMode.type === 'class') {
                newProject.structure.modules.forEach(mod => {
                    mod.packages.forEach(pkg => {
                        const cls = pkg.classes.find(c => c.id === modalMode.editId);
                        if (cls) {
                            cls.name = formData.name;
                            cls.type = formData.classType;
                            cls.attributes = formData.attributes.map(a => `${a.name}:${a.type}`);
                            cls.methods = formData.methods.map(method => {
                                const paramString = method.parameters
                                    .map(p => `${p.name}:${p.type}`)
                                    .join(', ');
                                return `${method.name}(${paramString}):${method.returnType}`;
                            });
                        }
                    });
                });
            }
        } else {
            const newId = `${modalMode.type.charAt(0)}${Date.now()}`;
            if (modalMode.type === 'module') {
                newProject.structure.modules.push({ id: newId, name: formData.name, packages: [] });
            } else if (modalMode.type === 'package') {
                const mod = newProject.structure.modules.find(m => m.id === modalMode.parentId);
                if (mod) {
                    mod.packages.push({ id: newId, name: formData.name, classes: [] });
                }
            } else if (modalMode.type === 'class') {
                newProject.structure.modules.forEach(mod => {
                    const pkg = mod.packages.find(p => p.id === modalMode.parentId);
                    if (pkg) {
                        pkg.classes.push({
                            id: newId,
                            name: formData.name,
                            type: formData.classType,
                            attributes: formData.attributes.map(a => `${a.name}:${a.type}`),
                            methods: formData.methods.map(method => {
                                const paramString = method.parameters
                                    .map(p => `${p.name}:${p.type}`)
                                    .join(', ');
                                return `${method.name}(${paramString}):${method.returnType}`;
                            })
                        });
                    }
                });
            }
        }
        onUpdate(newProject);
        onClose();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 pb-2 mb-4">
                {modalMode.editMode ? 'Editar' : 'Novo'}{' '}
                {modalMode.type === 'module' && 'Módulo'}
                {modalMode.type === 'package' && `Pacote${modalMode.editMode ? '' : ` em ${modalMode.parentName}`}`}
                {modalMode.type === 'class' && `Classe${modalMode.editMode ? '' : ` em ${modalMode.parentName}`}`}
            </div>
            {modalMode.type === 'class' && (
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tipo de Classe</label>
                    <div className="flex gap-2">
                        {ClassTypes.map(type => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, classType: type.value as 'concrete' | 'abstract' | 'interface' }))}
                                className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${formData.classType === type.value
                                    ? `border-${type.color}-600 bg-${type.color}-50 text-${type.color}-700`
                                    : 'border-neutral-300 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Nome</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={`Digite o nome do ${modalMode.type}...`}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
            </div>
            {modalMode.type === 'class' && (
                <>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Atributos</label>
                        {formData.attributes.length > 0 && (
                            <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-600">
                                {formData.attributes.map((attr, index) => (
                                    <div key={index} className="flex items-center justify-between px-4 py-2">
                                        <span className="font-mono text-sm text-neutral-800 dark:text-neutral-100">
                                            {attr.name}: <span className="text-blue-600 dark:text-blue-400">{attr.type}</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttribute(index)}
                                            className="text-orange-500 hover:text-orange-600 transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentAttribute.name}
                                onChange={e => setCurrentAttribute(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Nome do atributo"
                                className="flex-1 text-sm px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 transition"
                                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAttribute())}
                            />
                            <select
                                value={currentAttribute.type}
                                onChange={e => setCurrentAttribute(prev => ({ ...prev, type: e.target.value }))}
                                className="px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 transition min-w-[100px]"
                            >
                                {DataTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button
                                type="button"
                                onClick={addAttribute}
                                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                                disabled={!currentAttribute.name.trim()}
                            >
                                <Plus size={16} />
                                Adicionar
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Métodos</label>
                        {formData.methods.length > 0 && (
                            <div className="border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-600">
                                {formData.methods.map((meth, index) => (
                                    <div key={index} className="flex items-center justify-between px-4 py-2">
                                        <span className="font-mono text-sm text-neutral-800 dark:text-neutral-100">
                                            {meth.name}(
                                            {meth.parameters.map(p => `${p.name}:${p.type}`).join(', ')}
                                            ): <span className="text-blue-600 dark:text-blue-400">{meth.returnType}</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeMethod(index)}
                                            className="text-orange-500 hover:text-orange-600 transition"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="space-y-3 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                            <div className='flex gap-2'>
                                <input
                                    type="text"
                                    value={currentMethod.name}
                                    onChange={e => setCurrentMethod(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Nome do método"
                                    className="flex-1 text-sm px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 transition"
                                />
                                <select
                                    value={currentMethod.returnType}
                                    onChange={e => setCurrentMethod(prev => ({ ...prev, returnType: e.target.value }))}
                                    className="px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 transition min-w-[100px]"
                                >
                                    <option value="void">void</option>
                                    {DataTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 border-t pt-2 border-neutral-100 dark:border-neutral-700">Parâmetros (Adicionar):</label>
                                {currentMethod.tempParameters.length > 0 && (
                                    <div className="mb-2 space-y-1 max-h-24 overflow-y-auto pr-1">
                                        {currentMethod.tempParameters.map((p, index) => (
                                            <div key={index} className="flex items-center justify-between px-3 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-md">
                                                <span className="font-mono text-xs text-neutral-800 dark:text-neutral-100">
                                                    {p.name}: <span className="text-blue-600 dark:text-blue-400">{p.type}</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTempParameter(index)}
                                                    className="text-orange-400 hover:text-orange-500 transition"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={currentParameter.name}
                                        onChange={e => setCurrentParameter(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Nome do parâmetro"
                                        className="flex-1 text-sm px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 transition"
                                    />
                                    <select
                                        value={currentParameter.type}
                                        onChange={e => setCurrentParameter(prev => ({ ...prev, type: e.target.value }))}
                                        className="px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:ring-2 focus:ring-blue-200 transition min-w-[100px]"
                                    >
                                        {DataTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={addTempParameter}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                        disabled={!currentParameter.name.trim()}
                                    >
                                        <Plus size={16} />
                                        Adicionar
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addMethod}
                                className="w-full mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm disabled:opacity-50"
                                disabled={!currentMethod.name.trim()}
                            >
                                Adicionar Método
                            </button>
                        </div>
                    </div>
                </>
            )}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition font-medium text-sm"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-50"
                    disabled={!formData.name.trim()}
                >
                    {modalMode.editMode ? 'Salvar Alterações' : 'Criar'}
                </button>
            </div>
        </form>
    );
};

export default ElementModalForm;
