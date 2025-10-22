import React, { useState } from 'react';
import Select from './Select';

interface Props {
    allClasses: { name: string }[];
    onAdd: (data: { type: string; origin: string; dest: string }) => void;
}

const RelationForm: React.FC<Props> = ({ allClasses, onAdd }) => {
    const [type, setType] = useState('');
    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [error, setError] = useState('');

    function handleAdd() {
        if (!type || !origin || !dest) return setError('Preencha todos os campos');
        onAdd({ type, origin, dest });
        setType(''); setOrigin(''); setDest(''); setError('');
    }

    return (
        <div className="border rounded p-4 mb-4">
            <div className="font-semibold mb-2">Relacionamento</div>
            <Select
                value={type}
                onChange={e => setType(e.target.value)}
                options={[
                    { value: '', label: 'Selecione o tipo de relacionamento' },
                    { value: 'heranca', label: 'Herança' },
                    { value: 'implementacao', label: 'Implementação' },
                    { value: 'associacao', label: 'Associação' },
                    { value: 'agregacao', label: 'Agregação' },
                ]}
            />
            <Select
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                options={[{ value: '', label: 'Classe de origem' }, ...allClasses.map((c) => ({ value: c.name, label: c.name }))]}
            />
            <Select
                value={dest}
                onChange={e => setDest(e.target.value)}
                options={[{ value: '', label: 'Classe de destino' }, ...allClasses.map((c) => ({ value: c.name, label: c.name }))]}
            />
            <button type="button" className="w-full bg-blue-600 text-white rounded py-2" onClick={handleAdd}>Adicionar relacionamento</button>
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default RelationForm;
