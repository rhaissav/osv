import type { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller.ts';

const controller = new AuthController();

export async function authRoutes(server: FastifyInstance) {
  server.post('/register', controller.register.bind(controller));
  server.post('/login', controller.login.bind(controller));
}
