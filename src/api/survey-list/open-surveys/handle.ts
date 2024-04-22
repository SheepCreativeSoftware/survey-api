import type { Handler } from 'express';
import type { ResponseBody } from './response';
import { NotFoundException, UnauthorizedException } from '../../../modules/misc/customErrors';
import { buntstift } from 'buntstift';
import { getConnection } from '../../../database/connectDatabase';
import { SelectSurveyParser } from './sqlOutputValidation';

const openSurveysHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (req.user?.role === 'Answerer' || typeof req.user?.userId === 'undefined') {
				throw new UnauthorizedException('User is not logged in');
			}

			const { userId } = req.user;
			const conn = await getConnection();
			const response = await conn.query(
				{
					sql: `SELECT survey.survey_id as 'surveyId', survey_name as 'surveyName',
						survey_description as 'surveyDescription', choices_type as 'choicesType',
						created, end_date as 'endDate', option_id as 'optionId', option_name as 'optionName', content
						FROM survey
						INNER JOIN options ON survey.survey_id = options.survey_id
						WHERE user_id = ?
						AND completed = false`,
					nestTables: true,
				},
				[userId],
			);

			if (response.length === 0) {
				throw new NotFoundException();
			}

			const dataFromDb = SelectSurveyParser.safeParse(response);
			if (!dataFromDb.success) {
				buntstift.error(dataFromDb.error.message);
				throw new Error('Internal Server Error');
			}

			// Convert One-to-Many relation
			const { data } = dataFromDb;
			const responseBody: ResponseBody = [];
			for (const row of data) {
				const { options, survey } = row;
				const indexOf = responseBody.findIndex(item => item.surveyId === survey.surveyId);

				if (indexOf === -1) {
					responseBody.push({
						...survey,
						options: [options],
					});
				} else {
					responseBody[indexOf].options.push(options);
				}
			}

			res.status(200).send(responseBody);
		} catch (error) {
			next(error);
		}
	};
};

export { openSurveysHandler };
