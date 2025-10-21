
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import PasswordRecovery from './pages/PasswordRecovery';
import Projects from './pages/Projects';
import Profile from './pages/Profile';
import ProjectCreate from './pages/ProjectCreate';
import Sidebar from './components/Sidebar';
import React, { useState } from 'react';
import PrivateRoute from './routes/PrivateRoute';
import './index.css';


function ProtectedLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  // Handler para receber o estado do Sidebar
  const handleSidebarExpand = (expanded: boolean) => setSidebarExpanded(expanded);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onExpand={handleSidebarExpand} />
      <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'pl-60' : 'pl-20'}`}><Outlet /></main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<ProjectCreate />} />
            <Route path="/projects/:id/edit" element={<ProjectCreate />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="/password-recovery" element={<PasswordRecovery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

