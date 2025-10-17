import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            <Header />

            <div className="pt-16">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            OVS - Object Set Visualizer
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Uma ferramenta moderna para visualização e gerenciamento de conjuntos de objetos de forma intuitiva e colaborativa.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <div className="w-12 h-12 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Visualização Intuitiva</h3>
                            <p className="text-gray-600">Interface moderna e responsiva para visualizar conjuntos de dados de forma clara e organizada.</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <div className="w-12 h-12 bg-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Colaboração</h3>
                            <p className="text-gray-600">Trabalhe em equipe com controle de acesso e gerenciamento de projetos colaborativos.</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-md">
                            <div className="w-12 h-12 bg-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Performance</h3>
                            <p className="text-gray-600">Processamento rápido e eficiente, otimizado para grandes volumes de dados.</p>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Pronto para começar?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Crie sua conta e comece a visualizar seus dados de forma mais eficiente.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button variant="primary">Criar Conta</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary">Fazer Login</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}