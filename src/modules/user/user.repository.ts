
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}
