import React, { useState, useEffect } from 'react';
import { FaProjectDiagram, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from './Button';

const menuItems = [
    { icon: <FaProjectDiagram />, label: 'Projetos', to: '/projects', color: 'bg-blue-500' },
    { icon: <FaUser />, label: 'Perfil', to: '/profile', color: 'bg-green-500' },
];

export default function Sidebar() {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const [user, setUser] = useState<{ name: string; email: string }>({ name: '', email: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        api.get('/me')
            .then(res => {
                setUser({ name: res.data.name, email: res.data.email });
            })
            .catch(() => {
                setUser({ name: '', email: '' });
            });
    }, []);

    function handleLogout() {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <aside
            className={`h-screen flex flex-col justify-between bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ${expanded ? 'w-60' : 'w-20'} group`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div>
                <div className="flex items-center justify-center py-8 select-none">
                    {expanded ? (
                        <span className="text-xl font-bold text-blue-600 text-center leading-tight transition-all duration-300">Object Set Visualizer</span>
                    ) : (
                        <span className="text-2xl font-bold text-blue-600 transition-all duration-300">OSV</span>
                    )}
                </div>
                <nav className="flex flex-col gap-3 px-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            tabIndex={0}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 transition-all duration-150 ${item.color} hover:scale-[1.03] active:scale-[0.98] shadow-sm`}
                        >
                            <span className="text-xl text-white">{item.icon}</span>
                            {expanded && <span className="text-base text-white font-semibold">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="px-2 pb-6">
                {expanded && (
                    <div className="mb-4 flex flex-col items-start animate-fade-in">
                        <div className="flex items-center gap-2 mb-1">
                            <FaUser className="text-gray-500" />
                            <span className="font-semibold text-gray-700">{user.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                )}
                <Button
                    onClick={handleLogout}
                    variant="danger"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 transition-all duration-150"
                    style={{ justifyContent: 'flex-start', width: '100%' }}
                >
                    <FaSignOutAlt />
                    {expanded && <span>Sair</span>}
                </Button>
            </div>
        </aside>
    );
}
