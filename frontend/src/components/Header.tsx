import { Link } from 'react-router-dom';
import Logo from './Logo';

interface HeaderProps {
    transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
    return (
        <header className={`fixed top-0 left-0 right-0 z-50 ${transparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-sm border-b border-gray-200'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Nome do App */}
                    <div className="flex items-center space-x-2">
                        <Logo size={32} />
                        <h2 className="text-xl font-bold text-primary">OVS</h2>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-6">
                        <Link
                            to="/about"
                            className="text-gray-600 hover:text-primary transition-colors font-medium"
                        >
                            Sobre
                        </Link>
                        <Link
                            to="/login"
                            className="text-primary hover:text-primary-dark transition-colors font-medium"
                        >
                            Entrar
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}