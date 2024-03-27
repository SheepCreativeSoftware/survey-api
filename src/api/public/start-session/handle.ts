import type { Handler } from 'express';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';

const startSessionHandle = (): Handler => {
	return (req, res) => {
		try {
			let csrfToken = '';
			if (typeof req.csrfToken === 'function') {
				csrfToken = req.csrfToken();
			} else {
				throw new Error('Failed to generate CSRF Token');
			}
			handleSuccessResponse(req, res, { csrfToken });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { startSessionHandle };
