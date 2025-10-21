

import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export class UserRepository {
  async findByPasswordRecoveryToken(token: string) {
    return prisma.user.findFirst({ where: { passwordRecoveryToken: token } });
  }

  async updatePassword(id: string, newPassword: string) {
    // Aqui você pode aplicar hash se necessário
    return prisma.user.update({ where: { id }, data: { password_hash: newPassword } });
  }

  async clearPasswordRecoveryToken(id: string) {
    return prisma.user.update({ where: { id }, data: { passwordRecoveryToken: null, passwordRecoveryTokenExpires: null } });
  }
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
