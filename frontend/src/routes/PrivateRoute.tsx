
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PrivateRoute() {
    const [checking, setChecking] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuth(!!token);
        setChecking(false);
    }, []);

    if (checking) {
        return <div className="flex items-center justify-center min-h-screen text-gray-500">Carregando...</div>;
    }
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}
