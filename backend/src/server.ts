import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { authRoutes } from './modules/auth/routes.ts';
import { projectRoutes } from './modules/project/routes.ts';
import { userRoutes } from './modules/user/routes.ts';
import { passwordRecoveryRoutes } from './modules/auth/password-recovery.routes.ts';
import { completeSignupRoutes } from './modules/auth/complete-signup.routes.ts';

const server = Fastify();

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || '',
});

server.addHook('onRequest', async (request, reply) => {
  const publicRoutes = [
    '/login',
    '/register',
    '/',
    '/password-recovery',
    '/complete-signup',
  ];
  if (publicRoutes.some(route => request.url.startsWith(route))) {
    return;
  }
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.code(401).send({ error: 'Token inválido ou ausente' });
  }
});

server.get('/', async (request, reply) => {
  return { status: 'API Fastify rodando!' };
});


authRoutes(server);
projectRoutes(server);
userRoutes(server);
passwordRecoveryRoutes(server);
completeSignupRoutes(server);

const start = async () => {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Servidor rodando em http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
