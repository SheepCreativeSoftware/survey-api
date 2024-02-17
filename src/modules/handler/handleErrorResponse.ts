// eslint-disable-next-line no-shadow
import { Request, Response } from 'express';
import { buntstift } from 'buntstift';
import { expressLogger } from '../misc/expressLogger';
import { statusCode } from '../misc/statusCodes';
import { ZodError } from 'zod';

const handleErrorResponse = (req: Request, res: Response, error: unknown) => {
	let statusObj = statusCode.internalError;
	if(error instanceof Error) buntstift.error(`${error.name}: ${error.message}`);
	if(error instanceof ZodError) statusObj = statusCode.badRequest;
	if(error instanceof Error && error.message === 'Forbidden') statusObj = statusCode.forbidden;
	res.status(statusObj.statusCode).send(statusObj);
	expressLogger('success', req, res);
};

export { handleErrorResponse };
