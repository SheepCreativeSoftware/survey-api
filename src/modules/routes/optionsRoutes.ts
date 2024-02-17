
import express from 'express';
import { addOptionToDb, getOptionFromDb } from '../database/options/optionsDb';
import { handleErrorResponse } from '../handler/handleErrorResponse';
import { handleSuccessResponse } from '../handler/handleSuccessResponse';
import { z as zod } from 'zod';


// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Gets options for this survey from DB
 */

const getOptionParams = zod.object({
	creationToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
	optionId: zod.string().uuid(),
});

router.get('/getOption', async (req, res) => {
	try {
		const params = getOptionParams.parse(req.params);
		const options = await getOptionFromDb(params.creationToken, params.optionId);
		handleSuccessResponse(req, res, options);
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

/**
 * Add a new option for this survey to DB
 */

const addOptionRequest = zod.object({
	creationToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
	optionName: zod.string(),
	content: zod.string(),
});

router.post('/addOption', async (req, res) => {
	try {
		const { content, creationToken, optionName } = addOptionRequest.parse(req.body);
		const optionId = await addOptionToDb(creationToken, optionName, content);
		handleSuccessResponse(req, res, { optionId });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});


export { router as optionsRoutes };
