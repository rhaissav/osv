import PDFDocument from 'pdfkit';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ProjectService } from './project.service.ts';
import { ProjectRepository } from './project.repository.ts';
import type { CreateProjectDTO, UpdateProjectDTO } from './project.types.ts';

const repository = new ProjectRepository();
const service = new ProjectService(repository);

export class ProjectController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as CreateProjectDTO;
    // @ts-ignore
    const owner_id = request.user.sub;
    const project = await service.create(data, owner_id);
    return reply.code(201).send(project);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    // @ts-ignore
    const userId = request.user.sub;
    const role = await service.getUserRole(id, userId);
    if (!role) return reply.code(403).send({ error: 'Acesso negado: você não faz parte deste projeto.' });
    const project = await service.findById(id);
    if (!project) return reply.code(404).send({ error: 'Projeto não encontrado' });
    return reply.send(project);
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const userId = request.user.sub;
    const result = await service.getProjectsForUserWithRole(userId);
    return reply.send(result);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    // @ts-ignore
    const userId = request.user.sub;
    const role = await service.getUserRole(id, userId);
    if (role !== 'OWNER') {
      return reply.code(403).send({ error: 'Acesso negado: apenas o proprietário pode editar o projeto.' });
    }
    const updated = await service.update(id, request.body as UpdateProjectDTO);
    return reply.send(updated);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    // @ts-ignore
    const userId = request.user.sub;
    const role = await service.getUserRole(id, userId);
    if (role !== 'OWNER') {
      return reply.code(403).send({ error: 'Acesso negado: apenas o proprietário pode excluir o projeto.' });
    }
    await service.delete(id);
    return reply.code(204).send();
  }

  async exportToPdf(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    // @ts-ignore
    const userId = request.user.sub;
    const role = await service.getUserRole(id, userId);
    if (!role) {
      return reply.code(403).send({ error: 'Acesso negado: você não faz parte deste projeto.' });
    }
    const project = await service.findById(id);
    if (!project) return reply.code(404).send({ error: 'Projeto não encontrado' });
    const doc = new PDFDocument();
    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename="project-${id}.pdf"`);
    doc.text(`Projeto: ${project.title}`);
    doc.text(`Descrição: ${project.description || ''}`);
    doc.text(`Estrutura:`);
    doc.text(JSON.stringify(project.structure, null, 2));
    doc.end();
    return reply.send(doc);
  }

  async addMember(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const { email } = request.body as any;
    console.log('Parâmetros recebidos:', { id, email });
    // @ts-ignore
    const userId = request.user.sub;
    const role = await service.getUserRole(id, userId);
    if (role !== 'OWNER') {
      return reply.code(403).send({ error: 'Apenas o proprietário pode adicionar membros.' });
    }
    await service.addMemberByEmail(id, email);
    return reply.code(201).send({ message: 'Membro adicionado ao projeto.' });
  }
}
