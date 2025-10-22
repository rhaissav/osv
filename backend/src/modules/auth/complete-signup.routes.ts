import type { FastifyInstance } from 'fastify';
import { CompleteSignupController } from './complete-signup.controller';

const controller = new CompleteSignupController();

export async function completeSignupRoutes(server: FastifyInstance) {
  server.post('/complete-signup', controller.complete.bind(controller));
}
