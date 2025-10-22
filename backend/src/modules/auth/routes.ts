import type { FastifyInstance } from 'fastify';
import { AuthController } from './auth.controller';

const controller = new AuthController();

export async function authRoutes(server: FastifyInstance) {
  server.post('/register', controller.register.bind(controller));
  server.post('/login', controller.login.bind(controller));
  server.post('/refresh-token', async (request, reply) => {
    const user = request.user as any;
    if (!user || !user.sub || !user.role) return reply.code(401).send({ error: 'Não autenticado' });
    const jwtSign = (payload: object, options?: object) => (request.server as any).jwt.sign(payload, options);
    const token = jwtSign({ sub: user.sub, role: user.role }, { expiresIn: '1h' });
    return reply.send({ token });
  });
}
