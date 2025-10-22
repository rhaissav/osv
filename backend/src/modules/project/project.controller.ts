import PDFDocument from 'pdfkit';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ProjectService } from './project.service.ts';
import { ProjectRepository } from './project.repository.ts';
import type { CreateProjectDTO, UpdateProjectDTO } from './project.types.ts';

const repository = new ProjectRepository();
const service = new ProjectService(repository);

export class ProjectController {

  async getMembers(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    // @ts-ignore
    const userId = request.user.sub;
    const role = await service.getUserRole(id, userId);
    if (!role) return reply.code(403).send({ error: 'Acesso negado: você não faz parte deste projeto.' });
    const members = await service.getProjectMembers(id);
    // Retorna apenas id, email, nome e role de cada membro
    const formatted = members.map((m: any) => ({
      id: m.user.id,
      email: m.user.email,
      name: m.user.name,
      role: m.role
    }));
    return reply.send(formatted);
  }
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
    return reply.send({ ...project, role });
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
    console.log('role', role)
    if (!role) {
      return reply.code(403).send({ error: 'Acesso negado: você não faz parte deste projeto.' });
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
    const puppeteer = await import('puppeteer');
    const { id } = request.params as any;
    // @ts-ignore
    const userId = request.user.sub;
    const role = await service.getUserRole(id, userId);
    if (!role) {
      return reply.code(403).send({ error: 'Acesso negado: você não faz parte deste projeto.' });
    }

    const authHeader = request.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const printViewUrl = `${frontendUrl}/project/${id}/print-view`;

    const browser = await puppeteer.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(frontendUrl, { waitUntil: 'domcontentloaded' });
    await page.evaluate((token) => {
      localStorage.setItem('token', token);
    }, token);

    page.on('console', msg => {
      for (let i = 0; i < msg.args().length; ++i)
        console.log(`PAGE LOG[${i}]:`, msg.args()[i]);
      console.log('PAGE LOG:', msg.text());
    });
    page.on('pageerror', error => {
      console.error('PAGE ERROR:', error);
    });

    await page.goto(printViewUrl, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 800));
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename=\"project-${id}.pdf\"`);
    return reply.send(pdfBuffer);
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
