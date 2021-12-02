/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cookieParser from 'cookie-parser';
import express, { Express, Request, Response } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import errorMiddleware from './middlewares/error.middleware';
import BaseRouter from './routes';

const app: Express = express();

app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

app.use('/api', BaseRouter);
app.use(errorMiddleware);

/** **********************************************************************************
 *                              Serve front-end content
 ********************************************************************************** */

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.get('*', (_req: Request, res: Response) => {
  res.sendFile('index.html', { root: viewsDir });
});

export default app;
