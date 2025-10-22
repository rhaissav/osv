import api from '../api/axios';

export async function getProjectMembers(projectId: string) {
    const res = await api.get(`/projects/${projectId}/members`);
    return res.data;
}
