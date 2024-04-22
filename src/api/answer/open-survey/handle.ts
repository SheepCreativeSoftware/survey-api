import type { Handler } from 'express';
import type { ResponseBody } from './response';
import {
	InternalServerException,
	NotFoundException,
	UnauthorizedException,
} from '../../../modules/misc/customErrors';
import { buntstift } from 'buntstift';
import { getConnection } from '../../../database/connectDatabase';
import { SelectSurveyParser } from './sqlOutputValidation';

const openSurveyHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (typeof req.user?.role === 'undefined' || req.user.role !== 'Answerer') {
				throw new UnauthorizedException('User is not logged in');
			}

			const { surveyId } = req.user;

			const conn = await getConnection();
			const response = await conn.query(
				{
					sql: `SELECT survey.survey_id as 'surveyId', survey.survey_name as 'surveyName',
						survey.survey_description as 'surveyDescription', survey.choices_type as 'choicesType',
						survey.created, survey.end_date as 'endDate',
						options.option_id as 'optionId', options.option_name as 'optionName', options.content
						FROM survey
						INNER JOIN options ON survey.survey_id = options.survey_id
						WHERE survey.survey_id = ?
						AND completed = true`,
					nestTables: true,
				},
				[surveyId],
			);

			if (response.length === 0) {
				throw new NotFoundException();
			}

			const dataFromDb = SelectSurveyParser.safeParse(response);
			if (!dataFromDb.success) {
				buntstift.error(dataFromDb.error.message);
				throw new InternalServerException();
			}

			// Convert One-to-Many relation
			const { data } = dataFromDb;
			const { survey } = data[0];
			const responseBody: ResponseBody = {
				choicesType: survey.choicesType,
				created: survey.created,
				endDate: survey.endDate,
				options: [],
				surveyDescription: survey.surveyDescription,
				surveyId: survey.surveyId,
				surveyName: survey.surveyName,
			};
			for (const row of data) {
				const { options } = row;
				responseBody.options.push(options);
			}

			res.status(200).send(responseBody);
		} catch (error) {
			next(error);
		}
	};
};

export { openSurveyHandler };
