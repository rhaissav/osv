import { PrismaClient, Role } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: { id: string; name: string; email: string; password_hash: string; role: Role }) {
    console.log(data);
    return prisma.user.create({ data });
  }
}
