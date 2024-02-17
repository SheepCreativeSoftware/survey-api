// eslint-disable-next-line no-shadow
import { Request, Response } from 'express';
import { expressLogger } from '../misc/expressLogger.js';
import { statusCode } from '../misc/statusCodes.js';

const handleSuccessResponse = (req: Request, res: Response, responseObject: object) => {
	res.status(statusCode.created.statusCode).send(Object.assign({}, statusCode.created, responseObject));
	expressLogger('success', req, res);
};

export { handleSuccessResponse };
