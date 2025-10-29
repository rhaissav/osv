import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../api/project';
import SetTheoryView from '../components/SetTheoryView';

const ProjectPrintView = () => {
    const { id } = useParams();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getProject(id).then(data => {
                setProject(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Carregando...</div>;
    if (!project) return <div style={{ padding: 40, textAlign: 'center' }}>Projeto não encontrado</div>;

    // Adapta o objeto para o formato esperado pelo SetTheoryView
    const projectForSetTheory: any = {
        ...project,
        status: project.status === 'EM_ANDAMENTO' ? 'EM_ANDAMENTO' : 'CONCLUIDO',
        modules: project.structure?.modules || [],
        relations: project.structure?.relations || [],
        name: project.title || project.name || '',
    };

    return (
        <div className="bg-neutral-100 min-h-screen py-8 print:py-0">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8 print:shadow-none print:rounded-none print:p-0">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-12 mb-8 text-center print:mt-8 print:mb-6 print:text-center">
                    Visualização (Teoria dos Conjuntos)
                </h2>
                <SetTheoryView project={projectForSetTheory} onUpdate={() => { }} />
            </div>
        </div>
    );
};

export default ProjectPrintView;
