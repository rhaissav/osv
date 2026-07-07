import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (fastify) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*')
        .split(',')
        .map(origin => origin.trim())
        .filter(Boolean);

    await fastify.register(cors, {
        origin: allowedOrigins.includes('*') ? true : allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
});
