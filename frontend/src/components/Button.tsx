import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
    const base =
        'w-full py-2 rounded-lg font-semibold transition-all duration-150 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]';
    const variants = {
        primary:
            'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 focus:ring-blue-300 shadow-md hover:shadow-lg',
        secondary:
            'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300',
        danger:
            'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300',
    };
    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
