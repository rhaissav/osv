import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, ...props }) => (
    <div className="flex flex-col gap-1">
        {label && <label className="font-medium mb-1">{label}</label>}
        <select
            className={`border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : ''}`}
            {...props}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {error && <span className="text-red-600 text-xs">{error}</span>}
    </div>
);

export default Select;
