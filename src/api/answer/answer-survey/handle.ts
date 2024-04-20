import type { Handler } from 'express';
import type { ResultValues } from './insertResultIntoDb';
import { buntstift } from 'buntstift';
import { getConnection } from '../../../database/connectDatabase';
import { RequestBodyParser } from './request';
import { SelectSurveyParser } from './sqlOutputValidation';
import { statusCode } from '../../../modules/misc/statusCodes';
import { insertResultIntoDb } from './insertResultIntoDb';
import { combineResults } from './combineResults';

const answerSurveyHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (typeof req.user?.role === 'undefined' || req.user.role !== 'Answerer') {
				throw new Error('Unauthorized', { cause: 'User is not logged in' });
			}

			const { answererId, endDate, surveyId } = req.user;
			if (new Date(endDate) < new Date()) {
				throw new Error('Conflict', { cause: 'Survey has already ended' });
			}

			const requestBody = RequestBodyParser.parse(req.body);

			const conn = await getConnection();
			const response = await conn.query(
				{
					sql: `SELECT choices_type as 'choicesType'
						FROM survey
						WHERE survey.survey_id = ?
						AND completed = true`,
				},
				[surveyId],
			);

			if (response.length === 0) {
				throw new Error('Not Found');
			}

			const dataFromDb = SelectSurveyParser.safeParse(response);
			if (!dataFromDb.success) {
				buntstift.verbose(JSON.stringify(response));
				buntstift.error(dataFromDb.error.message);
				throw new Error('Internal Server Error');
			}

			const { data } = dataFromDb;
			const { choicesType } = data[0];
			const results: ResultValues[] = combineResults(choicesType, answererId, requestBody);

			await insertResultIntoDb(conn, results);

			res.status(statusCode.created.statusCode).send();
		} catch (error) {
			next(error);
		}
	};
};

export { answerSurveyHandler };
