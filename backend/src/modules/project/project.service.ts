import { ProjectRepository } from './project.repository.ts';
import type { CreateProjectDTO, UpdateProjectDTO } from './project.types.ts';
import { v7 as uuidv7 } from 'uuid';
import { MailService } from '../mail/mail.service.ts'

export class ProjectService {
  private readonly repository: ProjectRepository;
  private readonly mailService: MailService;
  constructor(repository: ProjectRepository) {
    this.repository = repository;
    this.mailService = new MailService();
  }

  async create(data: CreateProjectDTO, owner_id: string) {
    const projectId = uuidv7();
    const project = await this.repository.create({
      id: projectId,
      title: data.title,
      description: data.description,
      structure: data.structure,
      status: data.status || 'EM_ANDAMENTO',
    });
    await this.repository.addUserToProject(projectId, owner_id, 'OWNER');
    return project;
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async update(id: string, data: UpdateProjectDTO) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async getProjectsForUserWithRole(userId: string) {
    const userProjects = await this.repository.getUserProjects(userId);
    const meusProjetos = userProjects
      .filter((up: any) => up.role === 'OWNER')
      .map((up: any) => ({ ...up.project, role: up.role }));
    const colaboradorProjetos = userProjects
      .filter((up: any) => up.role === 'MEMBER')
      .map((up: any) => ({ ...up.project, role: up.role }));
    return {
      meusProjetos,
      colaboradorProjetos
    };
  }

  async getUserRole(projectId: string, userId: string) {
    if (!this.repository.getUserRoleInProject) throw new Error('Método getUserRoleInProject não implementado no repositório');
    const rel = await this.repository.getUserRoleInProject(projectId, userId);
    console.log('Relação usuário-projeto encontrada:', rel);
    return rel?.role;
  }

  async addMemberByEmail(projectId: string, email: string, projectTitle?: string) {
    const user = await this.repository.findUserByEmail(email);
    let userId: string;
    let created = false;
    let inviteLink: string;
    if (user) {
      userId = user.id;
      inviteLink = `${process.env.APP_URL}/login`;
    } else {
      // Cria usuário "pendente" (senha vazia, role USER)
      const newUser = await this.repository.createPendingUser(email);
      userId = newUser.id;
      created = true;
      inviteLink = `${process.env.APP_URL}/complete-signup?email=${encodeURIComponent(email)}`;
    }
    await this.repository.addUserToProject(projectId, userId, 'MEMBER');
    await this.mailService.sendProjectInvite(
      email,
      projectTitle || 'Projeto',
      !created,
      inviteLink
    );
    return { userId, created };
  }
}
