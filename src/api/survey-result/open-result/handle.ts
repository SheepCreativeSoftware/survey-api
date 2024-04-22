import type { Handler } from 'express';
import type { ResponseBody } from './response';
import {
	InternalServerException,
	NotFoundException,
	UnauthorizedException,
} from '../../../modules/misc/customErrors';
import { getConnection } from '../../../database/connectDatabase';
import { RequestQueryParser } from './request';
import { SqlResponseParser } from './sqlValidation';
import { buntstift } from 'buntstift';

const openResultHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (typeof req.user?.role === 'undefined') {
				throw new UnauthorizedException('User is not logged in');
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
				throw new NotFoundException();
			}

			const dataFromDb = SqlResponseParser.safeParse(response);
			if (!dataFromDb.success) {
				buntstift.error(dataFromDb.error.message);
				throw new InternalServerException();
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

			res.status(200).send(responseBody);
		} catch (error) {
			next(error);
		}
	};
};

export { openResultHandler };
