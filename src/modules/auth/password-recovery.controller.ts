import type { FastifyRequest, FastifyReply } from 'fastify';
import { PasswordRecoveryService } from './password-recovery.service.ts';
import { UserRepository } from '../user/user.repository.ts';
import { MailService } from '../mail/mail.service.ts';

const userRepository = new UserRepository();
const mailService = new MailService();
const service = new PasswordRecoveryService(userRepository, mailService);

export class PasswordRecoveryController {
  async requestRecovery(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as any;
    await service.requestRecovery(email);
    return reply.send({ message: 'Você receberá instruções para recuperar a senha em seu e-mail.' });
  }
}
