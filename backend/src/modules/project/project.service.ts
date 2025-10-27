import { ProjectRepository } from './project.repository';
import type { CreateProjectDTO, UpdateProjectDTO } from './project.types';
import { v7 as uuidv7 } from 'uuid';
import { MailService } from '../mail/mail.service'

export class ProjectService {
  async removeMember(projectId: string, userId: string) {
    console.log(projectId, userId)
    const userRole = await this.repository.getUserRoleInProject(projectId, userId);
    if (userRole?.role === 'OWNER') {
      throw new Error('Não é possível remover o proprietário do projeto.');
    }
    return this.repository.removeUserFromProject(projectId, userId);
  }
  private readonly repository: ProjectRepository;
  private readonly mailService: MailService;
  constructor(repository: ProjectRepository) {
    this.repository = repository;
    this.mailService = new MailService();
  }

  async create(data: CreateProjectDTO, owner_id: string) {
    console.log('Creating project with data:', data, 'and owner_id:', owner_id);
    const projectId = uuidv7();
    const project = await this.repository.create({
      id: projectId,
      title: data.title,
      description: data.description,
      structure: data.structure,
      status: data.status || 'EM_ANDAMENTO',
      updatedAt: new Date(),
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
    console.log('Dentro do service, deletando projeto com id:', id);
    // Remove todos os vínculos de usuários antes de deletar o projeto
    if (this.repository.removeAllUsersFromProject) {
      await this.repository.removeAllUsersFromProject(id);
    } else {
      // fallback manual se não existir método
      const repo: any = this.repository;
      if (repo.prisma && repo.prisma.userOnProjects) {
        await repo.prisma.userOnProjects.deleteMany({ where: { project_id: id } });
      }
    }
    return this.repository.delete(id);
  }

  async getProjectsForUserWithRole(userId: string) {
    const userProjects = await this.repository.getUserProjects(userId);
    const adaptMembers = (users: any[]) => users.map((u: any) => ({
      id: u.user.id,
      name: u.user.name,
      email: u.user.email,
      role: u.role
    }));


    const adaptProject = (up: any) => {
      const { users, ...projectData } = up.project;
      return {
        ...projectData,
        role: up.role,
        members: adaptMembers(up.project.users)
      };
    };

    const meusProjetos = userProjects
      .filter((up: any) => up.role === 'OWNER')
      .map(adaptProject);
    const colaboradorProjetos = userProjects
      .filter((up: any) => up.role === 'MEMBER')
      .map(adaptProject);
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

  async addMemberByEmail(projectId: string, email: string) {
    const project = await this.repository.findById(projectId);
    const title = project && 'title' in project ? project.title : undefined;

    const user = await this.repository.findUserByEmail(email);
    let userId: string;
    let created = false;
    let inviteLink: string;
    let isCompleted = true;
    let alreadyLinked = false;

    if (user) {
      console.log('user', user);
      userId = user.id;
      const isPending = !user.password_hash || user.password_hash.trim() === '';
      const userOnProject = await this.repository.getUserRoleInProject(projectId, userId);
      alreadyLinked = !!userOnProject;
      if (isPending) {
        inviteLink = `${process.env.APP_URL}/complete-signup?email=${encodeURIComponent(email)}`;
        isCompleted = false;
      } else {
        inviteLink = `${process.env.APP_URL}/login`;
      }
    } else {
      const newUser = await this.repository.createPendingUser(email);
      userId = newUser.id;
      created = true;
      inviteLink = `${process.env.APP_URL}/complete-signup?email=${encodeURIComponent(email)}`;
      isCompleted = false;
    }
    if (!alreadyLinked) {
      await this.repository.addUserToProject(projectId, userId, 'MEMBER');
    }
    await this.mailService.sendProjectInvite(
      email,
      title || 'Projeto',
      isCompleted,
      inviteLink
    );
    return { userId, created };
  }
  async getProjectMembers(projectId: string) {
    return this.repository.getProjectMembers(projectId);
  }
}
