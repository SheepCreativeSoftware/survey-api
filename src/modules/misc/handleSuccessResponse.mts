// eslint-disable-next-line no-shadow
import { Response } from 'express';
import { statusCode } from './statusCodes.mjs';

const handleSuccessResponse = (responseObject: object, res: Response) => {
	res.status(statusCode.created.statusCode).send(Object.assign({}, statusCode.created, responseObject));
};

export { handleSuccessResponse };
