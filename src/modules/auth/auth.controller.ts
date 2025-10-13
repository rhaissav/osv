import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service.ts';
import { AuthRepository } from './auth.repository.ts';
import type { RegisterDTO, LoginDTO } from './auth.types.ts';

const repository = new AuthRepository();
const service = new AuthService(repository);

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as RegisterDTO;
    const user = await service.register(data);
    return reply.code(201).send({ id: user.id, email: user.email });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as LoginDTO;
    const jwtSign = (payload: object, options?: object) => (request.server as any).jwt.sign(payload, options);
    const result = await service.login(data, jwtSign);
    if (!result) {
      return reply.code(401).send({ error: 'Credenciais inválidas' });
    }
    return reply.send(result);
  }
}
