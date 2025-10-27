import React from 'react';

interface ConfirmModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    projectName?: string;
    memberName?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onConfirm, onCancel, title, description, confirmText, cancelText, projectName, memberName }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border">
                <h2 className="text-lg font-semibold mb-2">{title || (memberName ? 'Remover colaborador' : 'Remover Projeto')}</h2>
                <p className="mb-4">
                    {description
                        ? description
                        : memberName
                            ? <>Tem certeza que deseja remover o colaborador <span className="font-bold">{memberName}</span>? Esta ação não pode ser desfeita.</>
                            : <>Tem certeza que deseja remover o projeto <span className="font-bold">{projectName}</span>? Esta ação não pode ser desfeita.</>
                    }
                </p>
                <div className="flex gap-2 justify-end">
                    <button className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={onCancel}>{cancelText || 'Cancelar'}</button>
                    <button className="px-4 py-2 rounded bg-orange-600 text-white" onClick={onConfirm}>{confirmText || 'Remover'}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
