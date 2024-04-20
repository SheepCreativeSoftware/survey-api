import type { Handler } from 'express';
import type { UUID } from 'node:crypto';
import { getConnection } from '../../../database/connectDatabase';
import { RequestQueryParser } from './request';
import { SelectSurveyParser } from './sqlValidation';
import { signJwtToken } from '../../../modules/protection/jwtHandling';
import { statusCode } from '../../../modules/misc/statusCodes';

const generateAnswerTokenHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (req.user?.role === 'Answerer' || typeof req.user?.userId === 'undefined') {
				throw new Error('Unauthorized', { cause: 'User is not logged in' });
			}

			const { userId } = req.user;
			const requestBody = RequestQueryParser.parse(req.query);

			const conn = await getConnection();
			const response = await conn.query(
				`SELECT survey_id as 'surveyId', end_date as 'endDate'
				FROM survey
				WHERE user_id = ?
				AND survey_id = ?
				AND completed = true`,
				[userId, requestBody.surveyId],
			);

			if (response.length === 0) {
				throw new Error('Not Found');
			}

			const dataFromDb = SelectSurveyParser.safeParse(response);
			if (!dataFromDb.success) {
				throw new Error('Internal Server Error', { cause: dataFromDb.error });
			}

			const { data } = dataFromDb;

			const token = await signJwtToken({
				role: 'Answerer',
				endDate: data[0].endDate,
				surveyId: data[0].surveyId as UUID,
			});

			res.status(statusCode.okay.statusCode).send({ token });
		} catch (error) {
			next(error);
		}
	};
};

export { generateAnswerTokenHandler };

// role: 'Answerer';
// surveyId: UUID;
// endDate: string;
// exp: number;
