import express from 'express';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { handleSuccessResponse } from '../handler/handleSuccessResponse';
import { z as zod } from 'zod';


// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/startSession', (req, res) => {
	try {
		let CSRFToken = '';
		if(typeof req.csrfToken === 'function') CSRFToken = req.csrfToken();
		else throw new Error('Failed to generate CSRF Token');
		handleSuccessResponse(req, res, { CSRFToken });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

const openShareParams = zod.object({
	publicToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
});

router.get('/openShare', (req, res) => {
	try {
		const { publicToken } = openShareParams.parse(req.params);

		// TODO: Return full survey with options
		handleSuccessResponse(req, res, { });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

export { router as defaultRoutes };
