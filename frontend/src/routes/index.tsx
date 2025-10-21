import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectCreate from '../pages/ProjectCreate';
import ProjectPrintView from '../pages/ProjectPrintView';
// ...importe outras páginas conforme necessário

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/project/:id" element={<ProjectCreate />} />
            <Route path="/project/:id/print-view" element={<ProjectPrintView />} />
            {/* Outras rotas aqui */}
        </Routes>
    </Router>
);

export default AppRoutes;
