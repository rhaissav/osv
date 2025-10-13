import type { FastifyRequest, FastifyReply } from 'fastify';
import { CompleteSignupService } from './complete-signup.service.ts';
import { UserRepository } from '../user/user.repository.ts';

const userRepository = new UserRepository();
const service = new CompleteSignupService(userRepository);

export class CompleteSignupController {
  async complete(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, password } = request.body as any;
    try {
      await service.completeSignup(email, name, password);
      return reply.send({ message: 'Cadastro finalizado com sucesso!' });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  }
}
