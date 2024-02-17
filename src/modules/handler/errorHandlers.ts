// eslint-disable-next-line no-shadow
import { NextFunction, Request, Response } from 'express';
import { buntstift } from 'buntstift';
import { expressLogger } from '../misc/expressLogger';
import { statusCode } from '../misc/statusCodes';

// Handle unknown routes error
const notFoundHandler = (req: Request, res: Response) => {
	res.status(statusCode.notFound.statusCode).send(statusCode.notFound);
};

// Handle Errors in middlewares
const clientErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if(err instanceof Error) buntstift.error(`${err.name}: ${err.message}`);
	if(err.stack) buntstift.error(err.stack);
	expressLogger('error', req, res);
	if(err.name === 'ForbiddenError') return res.status(statusCode.forbidden.statusCode).send(statusCode.forbidden);
	return next(err);
};

// Handle unexpected errors
const errorHandler = (err: Error, req: Request, res: Response) => {
	if(err instanceof Error) buntstift.error(`${err.name}: ${err.message}`);
	if(err.stack) buntstift.error(err.stack);
	expressLogger('error', req, res);
	res.status(statusCode.badRequest.statusCode).send(statusCode.badRequest);
};

export { errorHandler, clientErrorHandler, notFoundHandler };
