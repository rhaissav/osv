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
            'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 focus:ring-blue-300 shadow-md hover:shadow-lg dark:from-blue-800 dark:to-blue-700 dark:text-white dark:hover:from-blue-900 dark:hover:to-blue-800 dark:focus:ring-blue-900',
        secondary:
            'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600 dark:focus:ring-neutral-800',
        danger:
            'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-300 dark:bg-orange-700 dark:text-white dark:hover:bg-orange-800 dark:focus:ring-orange-900',
    };
    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}
