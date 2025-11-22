import pino from 'pino';
import { env } from './env';

export const logger = pino({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    transport:
        env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                },
            }
            : undefined,
    serializers: {
        req: (req) => ({
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            headers: {
                'user-agent': req.headers['user-agent'],
                'x-request-id': req.headers['x-request-id'],
            },
            remoteAddress: req.remoteAddress,
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
        err: pino.stdSerializers.err,
    },
});
