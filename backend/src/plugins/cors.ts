import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (fastify) => {
    await fastify.register(cors, {
        origin: '*', // Ajuste para o domínio do frontend em produção
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
});
