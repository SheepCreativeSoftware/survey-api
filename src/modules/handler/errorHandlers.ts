import type { NextFunction, Request, Response } from 'express';
import { buntstift } from 'buntstift';
import { statusCode } from '../misc/statusCodes';
import { ZodError } from 'zod';

const logOnError = (err: unknown, _req: Request, _res: Response, next: NextFunction) => {
	if (err instanceof Error) {
		buntstift.error(`${err.name}: ${err.message}`);
		if (err.stack) {
			buntstift.error(err.stack);
		}
		if (err.cause) {
			buntstift.error(JSON.stringify(err.cause));
		}
	}
	next(err);
};

// Handle unknown routes error
const notFoundHandler = (_req: Request, res: Response) => {
	res.status(statusCode.notFound.statusCode).send(statusCode.notFound);
};

// Handle Client Errors in middlewares
const clientErrorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ZodError) {
		return res.status(statusCode.badRequest.statusCode).json({ message: err.issues });
	}
	if (err instanceof Error) {
		switch (err.message) {
			case 'Not Found':
				return res.status(statusCode.notFound.statusCode).send({ message: err.cause });
			case 'Conflict':
				return res.status(statusCode.conflict.statusCode).send({ message: err.cause });
			case 'Bad Request':
				return res.status(statusCode.badRequest.statusCode).send({ message: err.cause });
			case 'Forbidden':
				return res.status(statusCode.forbidden.statusCode).send({ message: err.cause });
			case 'Unauthorized':
				return res.status(statusCode.unauthorized.statusCode).send({ message: err.cause });
		}
	}

	return next(err);
};

// Handle unexpected errors
const errorHandler = (_err: Error, _req: Request, res: Response, _next: NextFunction) => {
	res.status(statusCode.internalError.statusCode).send(statusCode.internalError);
};

export { errorHandler, clientErrorHandler, logOnError, notFoundHandler };
