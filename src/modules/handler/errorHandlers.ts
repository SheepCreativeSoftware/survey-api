import type { ErrorRequestHandler, Handler } from 'express';
import { buntstift } from 'buntstift';
import { NetworkException } from '../misc/customErrors';
import { ZodError } from 'zod';

const logOnError: ErrorRequestHandler = (err, _req, _res, next) => {
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
const notFoundHandler: Handler = (_req, res) => {
	res.status(404).send({
		error: 'Not Found',
		statusCode: 404,
	});
};

// Handle Client Errors in middlewares
const clientErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (err instanceof ZodError) {
		return res.status(400).json({ message: err.issues });
	}
	if (err instanceof NetworkException) {
		return res.status(err.statusCode).send({
			error: err.name,
			message: err.message || undefined,
			statusCode: err.statusCode,
		});
	}

	return next(err);
};

// Handle unexpected errors
const errorHandler: ErrorRequestHandler = (_err, _req, res, _next) => {
	res.status(500).send({
		error: 'Internal Server Error',
		statusCode: 500,
	});
};

export { errorHandler, clientErrorHandler, logOnError, notFoundHandler };
