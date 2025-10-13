import type { FastifyInstance } from 'fastify';
import { PasswordRecoveryController } from './password-recovery.controller.ts';

const controller = new PasswordRecoveryController();

export async function passwordRecoveryRoutes(server: FastifyInstance) {
  server.post('/password-recovery', controller.requestRecovery.bind(controller));
}
