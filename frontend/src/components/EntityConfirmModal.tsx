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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border">
                <h2 className="text-lg font-semibold mb-2">Remover {entityType}</h2>
                <p className="mb-4">Tem certeza que deseja remover o {entityType.toLowerCase()} <span className="font-bold">{entityName}</span>? Esta ação não pode ser desfeita.</p>
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={onCancel}>Cancelar</button>
                    <button className="px-4 py-2 rounded bg-orange-600 text-white" onClick={onConfirm}>Remover</button>
                </div>
            </div>
        </div>
    );
};

export default EntityConfirmModal;
