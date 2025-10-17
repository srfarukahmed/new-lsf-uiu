// src/app.ts
import swaggerDocument from '@src/docs/swaggerLoader';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';
import { attachRequestId } from './middlewares/requestId';
import v1Routes from './routes/v1.routes';
import httpLogger from './utils/httpLogger';
const app: Application = express();

// Security & CORS
app.use(cors());
app.use(helmet());

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request ID middleware (optional)
app.use(attachRequestId);

// HTTP logger
app.use(httpLogger);

// Routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// API Versioning with modular routes
app.use('/api/v1', v1Routes);
app.use('/check', (req, res) => {
  res.send('Server is running');
});

// Not found route handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
