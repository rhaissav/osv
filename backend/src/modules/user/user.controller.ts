import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import type { UpdateUserDTO } from './user.types';

const repository = new UserRepository();
const service = new UserService(repository);

export class UserController {
  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const userId = request.user.sub;
    const user = await service.getProfile(userId);
    return reply.send(user);
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const userId = request.user.sub;
    const updated = await service.updateProfile(userId, request.body as UpdateUserDTO);
    return reply.send(updated);
  }

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const userId = request.user.sub;
    await service.deleteAccount(userId);
    return reply.code(204).send();
  }
}
