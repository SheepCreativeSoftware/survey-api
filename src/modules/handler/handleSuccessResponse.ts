// eslint-disable-next-line no-shadow
import { Request, Response } from 'express';
import { statusCode, StatusObject } from '../misc/statusCodes';
import { expressLogger } from '../misc/expressLogger';

const handleResponse = (statusObj: StatusObject) => {
	return (req: Request, res: Response, ...responseObject: object[]) => {
		res.status(statusObj.statusCode).send(Object.assign({}, statusObj, ...responseObject));
		expressLogger('success', req, res);
	};
};

const handleSuccessResponse = handleResponse(statusCode.okay);
const handleCreationResponse = handleResponse(statusCode.created);

export { handleSuccessResponse, handleCreationResponse };
