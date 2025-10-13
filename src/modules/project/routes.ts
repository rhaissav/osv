import type { FastifyInstance } from 'fastify';
import { ProjectController } from './project.controller.ts';

const controller = new ProjectController();

export async function projectRoutes(server: FastifyInstance) {
  server.post('/projects', controller.create.bind(controller));
  server.get('/projects', controller.getAll.bind(controller));
  server.get('/projects/:id', controller.getById.bind(controller));
  server.put('/projects/:id', controller.update.bind(controller));
  server.delete('/projects/:id', controller.delete.bind(controller));
  server.get('/projects/:id/export/pdf', controller.exportToPdf.bind(controller));
  server.post('/projects/:id/users', controller.addMember.bind(controller));
}
