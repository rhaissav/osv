import React from 'react';

interface EntityConfirmModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    entityType: 'Módulo' | 'Pacote' | 'Classe';
    entityName: string;
}

const EntityConfirmModal: React.FC<EntityConfirmModalProps> = ({ open, onConfirm, onCancel, entityType, entityName }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg dark:shadow-xl p-6 w-full max-w-sm border border-gray-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-neutral-100">Remover {entityType}</h2>
                <p className="mb-4 text-gray-700 dark:text-neutral-200">Tem certeza que deseja remover o {entityType.toLowerCase()} <span className="font-bold dark:text-orange-300">{entityName}</span>? Esta ação não pode ser desfeita.</p>
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600" onClick={onCancel}>Cancelar</button>
                    <button className="px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600" onClick={onConfirm}>Remover</button>
                </div>
            </div>
        </div>
    );
};

export default EntityConfirmModal;
