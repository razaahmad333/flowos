import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import queueRoutes from './routes/queueRoutes';
import healthRoutes from './routes/healthRoutes';
import metaRoutes from './routes/metaRoutes';
import { errorHandler } from './utils/errors';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/queue', queueRoutes);
app.use('/api/health', healthRoutes);
app.use('/api', metaRoutes);

// Error handling
app.use(errorHandler);

export default app;
