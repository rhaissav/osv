import type { FastifyInstance } from 'fastify';
import { UserController } from './user.controller.ts';

const controller = new UserController();

export async function userRoutes(server: FastifyInstance) {
  server.get('/me', controller.getProfile.bind(controller));
  server.put('/me', controller.updateProfile.bind(controller));
  server.delete('/me', controller.deleteAccount.bind(controller));
}
