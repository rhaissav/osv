import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
    return (
        <div className="mb-4">
            <label className="block mb-1 text-sm text-left font-medium text-gray-700 dark:text-neutral-300">{label}</label>
            <input
                className={`w-full p-2 border border-gray-600 dark:border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 ${className}`}
                {...props}
            />
        </div>
    );
}
