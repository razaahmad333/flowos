import { cleanEnv, str, port, url } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
    PORT: port({ default: 4000 }),
    MONGO_URI: str(),
    REDIS_URL: str(),
    JWT_SECRET: str(),
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'development' }),
});
