import type { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { PasswordRecoveryService } from './password-recovery.service';
import { UserRepository } from '../user/user.repository';
import { MailService } from '../mail/mail.service';

const userRepository = new UserRepository();
const mailService = new MailService();
const service = new PasswordRecoveryService(userRepository, mailService);

export class PasswordRecoveryController {
  async requestRecovery(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as any;
    await service.requestRecovery(email);
    return reply.send({ message: 'Você receberá instruções para recuperar a senha em seu e-mail.' });
  }

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const { token, password } = request.body as any;
    const user = await userRepository.findByPasswordRecoveryToken(token);
    if (!user || !user.passwordRecoveryTokenExpires || new Date(user.passwordRecoveryTokenExpires) < new Date()) {
      return reply.code(400).send({ error: 'Token inválido ou expirado.' });
    }

    const newPasswordHash = await bcrypt.hash(password, 10);
    await userRepository.updatePassword(user.id, newPasswordHash);
    await userRepository.clearPasswordRecoveryToken(user.id);
    return reply.send({ message: 'Senha redefinida com sucesso.' });
  }
}
