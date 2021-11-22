import logger from '@shared/Logger';
import { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import HttpException from '../exceptions/HttpException';

const { BAD_REQUEST } = StatusCodes;

function errorMiddleware(err: HttpException, _request: Request, response: Response, next: NextFunction) {
  logger.err(err, true);
  return response.status(BAD_REQUEST).json({
    error: err.message,
  });
}
 
export default errorMiddleware;