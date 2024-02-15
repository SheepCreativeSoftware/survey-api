import { buntstift } from 'buntstift';
// eslint-disable-next-line no-shadow
import { Response } from 'express';
import { statusCode } from './statusCodes.mjs';
import { ZodError } from 'zod';

const handleErrorResponse = (error: unknown, res: Response) => {
	let statusObj = statusCode.internalError;
	if(error instanceof Error) buntstift.error(`${error.name}: ${error.message}`);
	if(error instanceof ZodError) statusObj = statusCode.badRequest;
	if(error instanceof Error && error.message === 'Forbidden') statusObj = statusCode.forbidden;
	return res.status(statusObj.statusCode).send(statusObj);
};

export { handleErrorResponse };
