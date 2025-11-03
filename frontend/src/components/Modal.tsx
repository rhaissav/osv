import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-neutral-900/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end p-3">
                <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition">
                    <X size={18} />
                </button>
            </div>
            <div className="px-6 pb-6">{children}</div>
        </div>
    </div>
);

export default Modal;
