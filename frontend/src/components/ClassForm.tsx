
import React, { useState } from 'react';
import Select from './Select';
import ClassTypeInfo from './ClassTypeInfo';

interface Attribute {
    visibility: 'privado' | 'protegido' | 'público';
    name: string;
    type: string;
}

interface MethodParam {
    name: string;
    type: string;
}

interface Method {
    visibility: 'privado' | 'protegido' | 'público';
    name: string;
    returnType: string;
    params: MethodParam[];
}

interface Props {
    allPkgs: { name: string }[];
    onAdd: (data: {
        name: string;
        type: 'concreta' | 'abstrata' | 'interface';
        attributes: Attribute[];
        methods: Method[];
        pkg: string;
    }) => void;
}

const visibilityOptions = [
    { value: 'privado', label: 'privado' },
    { value: 'protegido', label: 'protegido' },
    { value: 'público', label: 'público' },
];

const typeOptions = [
    { value: 'string', label: 'string' },
    { value: 'number', label: 'number' },
    { value: 'boolean', label: 'boolean' },
    { value: 'Date', label: 'Date' },
];

const ClassForm: React.FC<Props> = ({ allPkgs, onAdd }) => {
    const [pkg, setPkg] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState<'concreta' | 'abstrata' | 'interface'>('concreta');
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [methods, setMethods] = useState<Method[]>([]);
    const [error, setError] = useState('');

    // Attribute handlers
    const handleAddAttribute = () => {
        setAttributes([...attributes, { visibility: 'privado', name: '', type: 'string' }]);
    };
    const handleAttributeChange = (idx: number, field: keyof Attribute, value: string) => {
        setAttributes(attrs => attrs.map((a, i) => i === idx ? { ...a, [field]: value } : a));
    };
    const handleRemoveAttribute = (idx: number) => {
        setAttributes(attrs => attrs.filter((_, i) => i !== idx));
    };

    // Method handlers
    const handleAddMethod = () => {
        setMethods([...methods, { visibility: 'público', name: '', returnType: 'void', params: [] }]);
    };
    const handleMethodChange = (idx: number, field: keyof Omit<Method, 'params'>, value: string) => {
        setMethods(meths => meths.map((m, i) => i === idx ? { ...m, [field]: value } : m));
    };
    const handleRemoveMethod = (idx: number) => {
        setMethods(meths => meths.filter((_, i) => i !== idx));
    };

    // Method param handlers
    const handleAddParam = (mIdx: number) => {
        setMethods(meths => meths.map((m, i) => i === mIdx ? { ...m, params: [...m.params, { name: '', type: 'string' }] } : m));
    };
    const handleParamChange = (mIdx: number, pIdx: number, field: keyof MethodParam, value: string) => {
        setMethods(meths => meths.map((m, i) => i === mIdx ? { ...m, params: m.params.map((p, j) => j === pIdx ? { ...p, [field]: value } : p) } : m));
    };
    const handleRemoveParam = (mIdx: number, pIdx: number) => {
        setMethods(meths => meths.map((m, i) => i === mIdx ? { ...m, params: m.params.filter((_, j) => j !== pIdx) } : m));
    };

    function handleAdd() {
        if (!name.trim()) return setError('Nome obrigatório');
        if (!pkg) return setError('Selecione o pacote');
        onAdd({
            name: name.trim(),
            type,
            attributes: type !== 'interface' ? attributes : [],
            methods,
            pkg,
        });
        setName(''); setType('concreta'); setAttributes([]); setMethods([]); setPkg(''); setError('');
    }

    return (
        <div className="border rounded p-4 mb-4">
            <div className="font-semibold mb-2">Classe ou Interface</div>
            <Select
                value={pkg}
                onChange={e => setPkg(e.target.value)}
                options={[{ value: '', label: 'Selecione o pacote' }, ...allPkgs.map((p) => ({ value: p.name, label: p.name }))]}
            />
            <input className="border rounded px-2 py-1 w-full mb-1" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
            <Select
                value={type}
                onChange={e => setType(e.target.value as 'concreta' | 'abstrata' | 'interface')}
                options={[
                    { value: 'concreta', label: 'Classe Concreta' },
                    { value: 'abstrata', label: 'Classe Abstrata' },
                    { value: 'interface', label: 'Interface' },
                ]}
            />
            <ClassTypeInfo type={type} />

            {type !== 'interface' && (
                <div className="mt-4">
                    <div className="font-semibold mb-1">Atributos <button type="button" className="ml-2 text-blue-600 text-sm" onClick={handleAddAttribute}>+ Adicionar Atributo</button></div>
                    {attributes.map((attr, idx) => (
                        <div key={idx} className="flex items-center gap-2 mb-2">
                            <Select
                                value={attr.visibility}
                                onChange={e => handleAttributeChange(idx, 'visibility', e.target.value)}
                                options={visibilityOptions}
                                className="w-24"
                            />
                            <input className="border rounded px-2 py-1 flex-1" placeholder="nome" value={attr.name} onChange={e => handleAttributeChange(idx, 'name', e.target.value)} />
                            <Select
                                value={attr.type}
                                onChange={e => handleAttributeChange(idx, 'type', e.target.value)}
                                options={typeOptions}
                                className="w-28"
                            />
                            <button type="button" className="text-red-500" onClick={() => handleRemoveAttribute(idx)} title="Remover">🗑️</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4">
                <div className="font-semibold mb-1">Métodos <button type="button" className="ml-2 text-blue-600 text-sm" onClick={handleAddMethod}>+ Adicionar Método</button></div>
                {methods.map((meth, mIdx) => (
                    <div key={mIdx} className="border rounded p-2 mb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Select
                                value={meth.visibility}
                                onChange={e => handleMethodChange(mIdx, 'visibility', e.target.value)}
                                options={visibilityOptions}
                                className="w-24"
                            />
                            <input className="border rounded px-2 py-1 flex-1" placeholder="nome" value={meth.name} onChange={e => handleMethodChange(mIdx, 'name', e.target.value)} />
                            <Select
                                value={meth.returnType}
                                onChange={e => handleMethodChange(mIdx, 'returnType', e.target.value)}
                                options={[...typeOptions, { value: 'void', label: 'void' }]}
                                className="w-28"
                            />
                            <button type="button" className="text-red-500" onClick={() => handleRemoveMethod(mIdx)} title="Remover">🗑️</button>
                        </div>
                        <div className="ml-6">
                            <div className="text-sm text-gray-600 mb-1">Parâmetros <button type="button" className="ml-2 text-blue-600 text-xs" onClick={() => handleAddParam(mIdx)}>+ Adicionar Parâmetro</button></div>
                            {meth.params.map((param, pIdx) => (
                                <div key={pIdx} className="flex items-center gap-2 mb-1">
                                    <input className="border rounded px-2 py-1 flex-1" placeholder="nome" value={param.name} onChange={e => handleParamChange(mIdx, pIdx, 'name', e.target.value)} />
                                    <Select
                                        value={param.type}
                                        onChange={e => handleParamChange(mIdx, pIdx, 'type', e.target.value)}
                                        options={typeOptions}
                                        className="w-28"
                                    />
                                    <button type="button" className="text-red-500" onClick={() => handleRemoveParam(mIdx, pIdx)} title="Remover">🗑️</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" className="w-full bg-blue-600 text-white rounded py-2 mt-2" onClick={handleAdd}>Adicionar</button>
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default ClassForm;
