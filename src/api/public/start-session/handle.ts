import type { Handler } from 'express';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';

const startSessionHandle = (): Handler => {
	return (req, res, next) => {
		try {
			let csrfToken = '';
			if (typeof req.csrfToken === 'function') {
				csrfToken = req.csrfToken();
			} else {
				throw new Error('Failed to generate CSRF Token');
			}
			handleSuccessResponse(req, res, { csrfToken });
		} catch (error) {
			next(error);
		}
	};
};

export { startSessionHandle };
