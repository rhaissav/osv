import { Link } from 'react-router-dom';
import Logo from './Logo';

interface HeaderProps {
    transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
    return (
        <header className={`fixed top-0 left-0 right-0 z-50 ${transparent
            ? 'bg-transparent'
            : 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-neutral-700'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Nome do App */}
                    <div className="flex items-center space-x-2">
                        <Logo size={32} />
                        <h2 className="text-xl font-bold text-primary dark:text-neutral-100">OVS</h2>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-6">
                        <Link
                            to="/about"
                            className="text-gray-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                        >
                            Sobre
                        </Link>
                        <Link
                            to="/login"
                            className="text-primary dark:text-blue-400 hover:text-primary-dark dark:hover:text-blue-300 transition-colors font-medium"
                        >
                            Entrar
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}