import { addOptionToDb, getAllOptionFromDb, getOptionFromDb, removeOptionFromDb, updateOptionToDb } from '../database/options/optionsDb';
import { handleCreationResponse, handleSuccessResponse } from '../handler/handleSuccessResponse';
import express from 'express';
import { getPublicTokenFromDb } from '../database/survey/surveyDb';
import { handleErrorResponse } from '../handler/handleErrorResponse';
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
		const params = getOptionParams.parse(req.query);
		const options = await getOptionFromDb(params.creationToken, params.optionId);
		handleSuccessResponse(req, res, options);
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

/**
 * Gets All options for this survey from DB
 */

const creationTokenParam = zod.object({
	creationToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
});

router.get('/getAllOptions', async (req, res) => {
	try {
		const { creationToken } = creationTokenParam.parse(req.query);
		const options = await getAllOptionFromDb(creationToken);
		handleSuccessResponse(req, res, { options });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

/**
 * Gets share link for this survey
 */

router.get('/getShareLink', async (req, res) => {
	try {
		const { creationToken } = creationTokenParam.parse(req.query);
		const publicToken = await getPublicTokenFromDb(creationToken);
		if(typeof process.env.URL === 'undefined') throw new Error('Missing URL enviroment param');
		const shareUrl = new URL(process.env.URL);
		shareUrl.searchParams.set('shareToken', publicToken);
		handleSuccessResponse(req, res, { shareLink: shareUrl.toString() });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

/**
 * Add a new option for this survey to DB
 */

const addOptionRequest = zod.object({
	content: zod.string(),
	creationToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
	optionName: zod.string(),
});

router.post('/addOption', async (req, res) => {
	try {
		const { content, creationToken, optionName } = addOptionRequest.parse(req.body);

		// TODO: Content should be checked with dompurify
		const optionId = await addOptionToDb(creationToken, optionName, content);
		handleCreationResponse(req, res, { optionId });
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

/**
 * Update an existing option
 */

const updateOptionRequest = zod.object({
	content: zod.string(),
	creationToken: zod.string().regex(/^[A-Za-z0-9+/]*/),
	optionId: zod.string().uuid(),
	optionName: zod.string(),
});

router.post('/updateOption', async (req, res) => {
	try {
		const { content, creationToken, optionId, optionName } = updateOptionRequest.parse(req.body);

		// TODO: Content should be checked with dompurify
		await updateOptionToDb(creationToken, optionId, optionName, content);
		handleSuccessResponse(req, res, {});
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

/**
 * Removes a existing option
 */

router.post('/deleteOption', async (req, res) => {
	try {
		const { creationToken, optionId } = getOptionParams.parse(req.body);

		await removeOptionFromDb(creationToken, optionId);
		handleSuccessResponse(req, res, {});
	} catch (error) {
		handleErrorResponse(req, res, error);
	}
});

export { router as optionsRoutes };
