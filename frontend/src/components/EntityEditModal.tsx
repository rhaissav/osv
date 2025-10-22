import React, { useState } from 'react';

interface EntityEditModalProps {
    open: boolean;
    onSave: (newName: string) => void;
    onCancel: () => void;
    entityType: 'Módulo' | 'Pacote' | 'Classe';
    entityName: string;
}

const EntityEditModal: React.FC<EntityEditModalProps> = ({ open, onSave, onCancel, entityType, entityName }) => {
    const [name, setName] = useState(entityName);
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border">
                <h2 className="text-lg font-semibold mb-2">Editar {entityType}</h2>
                <input
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 mb-4"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={`Novo nome do ${entityType.toLowerCase()}`}
                />
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={onCancel}>Cancelar</button>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => onSave(name)} disabled={!name.trim()}>Salvar</button>
                </div>
            </div>
        </div>
    );
};

export default EntityEditModal;
