import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FlowOS API',
            version: '1.0.0',
            description: 'API Documentation for FlowOS Backend',
        },
        servers: [
            {
                url: `http://localhost:${env.PORT}/api/v1`,
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
