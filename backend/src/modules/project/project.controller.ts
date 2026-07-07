import PDFDocument from 'pdfkit';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import type { CreateProjectDTO, UpdateProjectDTO } from './project.types';

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
    let browser;
    try {
      const puppeteer = await import('puppeteer');
      const { id } = request.params as any;
      console.log('[PDF] Iniciando exportação para projeto:', id);
      // @ts-ignore
      const userId = request.user.sub;
      console.log('[PDF] userId:', userId);
      const role = await service.getUserRole(id, userId);
      console.log('[PDF] role:', role);
      if (!role) {
        console.warn('[PDF] Usuário não faz parte do projeto');
        return reply.code(403).send({ error: 'Acesso negado: você não faz parte deste projeto.' });
      }

      const authHeader = request.headers['authorization'] || '';
      const token = authHeader.replace('Bearer ', '');
      console.log('[PDF] Token extraído, tamanho:', token?.length);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const printViewUrl = `${frontendUrl.replace(/\/$/, '')}/project/${id}/print-view`;
      console.log('[PDF] frontendUrl:', frontendUrl);
      console.log('[PDF] printViewUrl:', printViewUrl);

      console.log('[PDF] Lançando navegador Puppeteer...');
      const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      browser = await puppeteer.default.launch({
        headless: 'shell',
        ...(executablePath ? { executablePath } : {}),
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--single-process',
          '--disable-software-rasterizer',
          '--disable-breakpad',
          '--disable-crash-reporter'
        ]
      });
      const page = await browser.newPage();

      console.log('[PDF] Navegando para frontendUrl para setar token...');
      const respFront = await page.goto(frontendUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });
      console.log('[PDF] Status navegação frontendUrl:', respFront?.status());

      console.log('[PDF] Setando token no localStorage...');
      await page.evaluate((token) => {
        localStorage.setItem('token', token);
      }, token);

      page.on('console', msg => {
        console.log('[PDF] PAGE CONSOLE:', msg.text());
      });
      page.on('pageerror', error => {
        console.error('[PDF] PAGE ERROR:', error);
      });
      page.on('requestfailed', request => {
        console.error('[PDF] REQUEST FAILED:', request.url(), request.failure()?.errorText);
      });

      console.log('[PDF] Navegando para printViewUrl...');
      const response = await page.goto(printViewUrl, {
        waitUntil: 'networkidle0',
        timeout: 60000
      });
      console.log('[PDF] Status navegação printViewUrl:', response?.status());

      const html = await page.content();
      console.log('[PDF] HTML carregado (primeiros 500 chars):', html?.slice(0, 500));

      console.log('[PDF] Aguardando renderização...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('[PDF] Gerando PDF...');
      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      console.log('[PDF] PDF gerado, tamanho:', pdfBuffer?.length);

      await browser.close();

      reply.header('Content-Type', 'application/pdf');
      reply.header('Content-Disposition', `attachment; filename="project-${id}.pdf"`);
      return reply.send(pdfBuffer);
    } catch (error: any) {
      console.error('[PDF] Erro ao exportar PDF:', error);
      console.error('[PDF] Stack trace:', error?.stack);
      if (browser) {
        try {
          await browser.close();
        } catch (closeError) {
          console.error('[PDF] Erro ao fechar navegador:', closeError);
        }
      }
      return reply.code(500).send({
        error: 'Falha ao exportar PDF',
        details: error?.message || String(error),
        stack: error?.stack
      });
    }
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

  async removeMember(request: FastifyRequest, reply: FastifyReply) {
    const { id, userId } = request.params as any;

    console.log(id, userId)
    // @ts-ignore
    const currentUserId = request.user.sub;
    const role = await service.getUserRole(id, currentUserId);
    if (role !== 'OWNER') {
      return reply.code(403).send({ error: 'Apenas o proprietário pode remover membros.' });
    }
    if (userId === currentUserId) {
      return reply.code(400).send({ error: 'O proprietário não pode remover a si mesmo.' });
    }
    await service.removeMember(id, userId);
    return reply.code(204).send();
  }
}
