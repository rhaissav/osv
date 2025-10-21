
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export class ProjectRepository {
  async removeAllUsersFromProject(projectId: string) {
    return prisma.userOnProjects.deleteMany({ where: { project_id: projectId } });
  }
  async create(data: any) {
    return prisma.project.create({ data });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        structure: true,
        createdAt: true,
        updatedAt: true,
        users: true
      }
    });
  }

  async findAll() {
    return prisma.project.findMany({ include: { users: true } });
  }

  async update(id: string, data: any) {
    return prisma.project.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        structure: true,
        createdAt: true,
        updatedAt: true,
        users: true
      }
    });
  }

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  }

  // Adiciona um usuário ao projeto
  async addUserToProject(projectId: string, userId: string, role: 'OWNER' | 'MEMBER' = 'MEMBER') {
    return prisma.userOnProjects.create({
      data: {
        project_id: projectId,
        user_id: userId,
        role
      }
    });
  }

  // Remove um usuário do projeto
  async removeUserFromProject(projectId: string, userId: string) {
    return prisma.userOnProjects.delete({
      where: {
        user_id_project_id: {
          user_id: userId,
          project_id: projectId
        }
      }
    });
  }

  // Busca todos os membros de um projeto
  async getProjectMembers(projectId: string) {
    return prisma.userOnProjects.findMany({
      where: { project_id: projectId },
      include: { user: true }
    });
  }

  // Busca todos os projetos de um usuário
  async getUserProjects(userId: string) {
    return prisma.userOnProjects.findMany({
      where: { user_id: userId },
      include: { project: true }
    });
  }

  async getUserRoleInProject(projectId: string, userId: string) {
    console.log('Getting role for user:', userId, 'in project:', projectId);
    return prisma.userOnProjects.findUnique({
      where: {
        user_id_project_id: {
          user_id: userId,
          project_id: projectId
        }
      }
    });
  }

  async findUserByEmail(email: string) {
    console.log('Finding user by email:', email);
    return prisma.user.findUnique({ where: { email } });
  }

  async createPendingUser(email: string) {
    return prisma.user.create({
      data: {
        email,
        name: email,
        password_hash: '',
        role: 'USER'
      }
    });
  }
}
