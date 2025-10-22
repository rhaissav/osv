import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <Header />
            <div className="pt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">OVS - Object Set Visualizer</h1>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                            O <b>Object Set Visualizer (OVS)</b> é uma ferramenta web para modelagem, visualização e gerenciamento de projetos baseados no paradigma orientado a objetos, com foco em colaboração, clareza e flexibilidade.<br /><br />
                            O OVS foi desenvolvido para apoiar atividades de Programação Orientada a Objetos, especialmente modelagem orientada a objetos, utilizando conceitos de <b>Teoria dos Conjuntos</b> para representar entidades, relações e operações de forma visual e intuitiva.
                        </p>
                    </div>

                    <div className="mb-10 grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Modelagem Visual</h3>
                            <p className="text-gray-600">Crie, edite e visualize módulos, pacotes, classes e relações com a Teoria dos Conjuntos.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Colaboração</h3>
                            <p className="text-gray-600">Gerencie projetos com múltiplos membros, controle de permissões.</p>
                        </div>
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Exportação e Compartilhamento</h3>
                            <p className="text-gray-600">Exporte projetos em PDF, compartilhe visualizações.</p>
                        </div>
                    </div>

                    <div className="text-center bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comece a usar o OVS</h2>
                        <p className="text-gray-600 mb-6">Crie sua conta gratuitamente e potencialize a modelagem dos seus projetos.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button variant="primary" className="min-w-[140px] px-6 py-3 text-base">Criar Conta</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" className="min-w-[140px] px-6 py-3 text-base">Fazer Login</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}