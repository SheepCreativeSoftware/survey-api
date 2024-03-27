import type { Request, Response } from 'express';
import { expressLogger } from '../misc/expressLogger';
import type { StatusObject } from '../misc/statusCodes';
import { statusCode } from '../misc/statusCodes';

const handleResponse = (statusObj: StatusObject) => {
	return (req: Request, res: Response, ...responseObject: object[]) => {
		res.status(statusObj.statusCode).send(Object.assign({}, statusObj, ...responseObject));
		expressLogger('success', req, res);
	};
};

const handleSuccessResponse = handleResponse(statusCode.okay);
const handleCreationResponse = handleResponse(statusCode.created);

export { handleSuccessResponse, handleCreationResponse };
