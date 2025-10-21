
import api from './axios';

export async function createProject({ title, description, status, structure }: { title: string; description: string; status: string; structure: any }) {
  const response = await api.post('/projects', {
    title,
    description,
    status,
    structure,
  });
  return response.data;
}

export async function updateProject({ id, title, description, status, structure }: { id: string; title: string; description: string; status: string; structure: any }) {
  const response = await api.put(`/projects/${id}`, {
    title,
    description,
    status,
    structure,
  });
  return response.data;
}

export async function deleteProject(id: string) {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
}

export async function getProject(id: string) {
  const response = await api.get(`/projects/${id}`);
  return response.data;
}