import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import type { Handler } from 'express';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';


const startSessionHandle = (): Handler => {
	return (req, res) => {
		try {
			let CSRFToken = '';
			if(typeof req.csrfToken === 'function') CSRFToken = req.csrfToken();
			else throw new Error('Failed to generate CSRF Token');
			handleSuccessResponse(req, res, { CSRFToken });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { startSessionHandle };
