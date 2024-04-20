import type { Handler } from 'express';
import type { ResponseBody } from './response';
import { RequestQueryParser } from './request';
import { getConnection } from '../../../database/connectDatabase';
import { SqlResponseParser } from './sqlValidation';
import { statusCode } from '../../../modules/misc/statusCodes';

const openResultHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (typeof req.user?.role === 'undefined') {
				throw new Error('Unauthorized', { cause: 'User is not logged in' });
			}

			// Survey Id must be provided or is provided as part of answerer token
			let surveyId = '';
			if (req.user.role === 'Answerer') {
				surveyId = req.user.surveyId;
			} else {
				surveyId = RequestQueryParser.parse(req.query).surveyId;
			}

			const conn = await getConnection();
			const response = await conn.query(
				`SELECT options.survey_id as 'surveyId', COUNT(result_id) as 'resultCount', results.option_id as 'optionId', submited
				FROM results
				INNER JOIN options
				WHERE results.option_id = options.option_id
				AND options.survey_id = ?
				GROUP BY results.option_id`,
				[surveyId],
			);

			if (response.length === 0) {
				throw new Error('Not Found');
			}

			const dataFromDb = SqlResponseParser.safeParse(response);
			if (!dataFromDb.success) {
				throw new Error('Internal Server Error', { cause: dataFromDb.error });
			}

			const { data } = dataFromDb;

			const responseBody: ResponseBody = {
				surveyId,
				totalCount: 0,
				results: [],
			};

			for (const row of data) {
				responseBody.results.push({
					optionId: row.optionId,
					resultCount: Number(row.resultCount),
				});
				responseBody.totalCount += Number(row.resultCount);
			}

			res.status(statusCode.okay.statusCode).send(responseBody);
		} catch (error) {
			next(error);
		}
	};
};

export { openResultHandler };
