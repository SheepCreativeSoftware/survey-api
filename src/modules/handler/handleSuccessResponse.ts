// eslint-disable-next-line no-shadow
import { Request, Response } from 'express';
import { expressLogger } from '../misc/expressLogger';
import { statusCode } from '../misc/statusCodes';

const handleSuccessResponse = (req: Request, res: Response, responseObject: object) => {
	res.status(statusCode.created.statusCode).send(Object.assign({}, statusCode.created, responseObject));
	expressLogger('success', req, res);
};

export { handleSuccessResponse };
