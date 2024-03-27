import type { Handler } from 'express';
import { getTokenFromDb } from '../../../database/survey/surveyDb';
import { handleErrorResponse } from '../../../modules/handler/handleErrorResponse';
import { handleSuccessResponse } from '../../../modules/handler/handleSuccessResponse';
import { checkCreationTokenObject } from '../../../modules/protection/zodRules';

/**
 * Gets share link for this survey
 */

const shareLinkHandle = (): Handler => {
	return async (req, res) => {
		try {
			const { creationToken } = checkCreationTokenObject.parse(req.query);
			const { publicToken } = await getTokenFromDb({ creationToken });
			if (typeof process.env.URL === 'undefined') {
				throw new Error('Missing URL enviroment param');
			}
			const shareUrl = new URL(process.env.URL);
			shareUrl.searchParams.set('shareToken', publicToken);
			handleSuccessResponse(req, res, { shareLink: shareUrl.toString() });
		} catch (error) {
			handleErrorResponse(req, res, error);
		}
	};
};

export { shareLinkHandle };
