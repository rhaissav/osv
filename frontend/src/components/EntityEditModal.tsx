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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg dark:shadow-xl p-6 w-full max-w-sm border border-neutral-300 dark:border-neutral-700">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-neutral-100">Editar {entityType}</h2>
                <input
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 mb-4 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={`Novo nome do ${entityType.toLowerCase()}`}
                />
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600" onClick={onCancel}>Cancelar</button>
                    <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600" onClick={() => onSave(name)} disabled={!name.trim()}>Salvar</button>
                </div>
            </div>
        </div>
    );
};

export default EntityEditModal;
