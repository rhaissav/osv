import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
    return (
        <div className="mb-4">
            <label className="block mb-1 text-sm text-left font-medium text-gray-700">{label}</label>
            <input
                className={`w-full p-2 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition ${className}`}
                {...props}
            />
        </div>
    );
}
