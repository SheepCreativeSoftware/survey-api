import type { Handler } from 'express';
import type { UUID } from 'node:crypto';
import { NotFoundException, UnauthorizedException } from '../../../modules/misc/customErrors';
import { buntstift } from 'buntstift';
import { getConnection } from '../../../database/connectDatabase';
import { RequestBodyParser } from './request';
import { SelectSurveyParser } from './sqlOutputValidation';
import { tinyToBoolean } from '../../../database/typecast';
import { updateOptions } from './updateOptions';
import { updateSurvey } from './updateSurvey';

const adjustSurveyHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (req.user?.role === 'Answerer' || typeof req.user?.userId === 'undefined') {
				throw new UnauthorizedException('User is not logged in');
			}

			const { userId } = req.user;
			const requestBody = RequestBodyParser.parse(req.body);

			const conn = await getConnection();
			const response = await conn.query(
				{
					typeCast: tinyToBoolean,
					sql: `SELECT survey.survey_id as 'surveyId', survey_name as 'surveyName',
						survey_description as 'surveyDescription', choices_type as 'choicesType',
						created, end_date as 'endDate', completed, option_id as 'optionId',
						option_name as 'optionName', content
						FROM survey
						INNER JOIN options ON survey.survey_id = options.survey_id
						WHERE user_id = ?
						AND survey.survey_id = ?
						AND completed = false`,
					nestTables: true,
				},
				[userId, requestBody.surveyId],
			);

			if (response.length === 0) {
				throw new NotFoundException();
			}

			const dataFromDb = SelectSurveyParser.safeParse(response);
			if (!dataFromDb.success) {
				buntstift.error(dataFromDb.error.message);
				throw new Error('Internal Server Error');
			}

			const { data } = dataFromDb;
			const { survey } = data[0];
			await updateSurvey(
				{
					choicesType: survey.choicesType,
					surveyId: survey.surveyId as UUID,
					completed: survey.completed,
					created: survey.created,
					endDate: survey.endDate,
					surveyDescription: survey.surveyDescription,
					surveyName: survey.surveyName,
				},
				{
					choicesType: requestBody.choicesType,
					endDate: new Date(requestBody.endDate),
					surveyDescription: requestBody.surveyDescription,
					surveyName: requestBody.surveyName,
				},
			);

			await updateOptions(data, requestBody.options);

			res.status(200).send();
		} catch (error) {
			next(error);
		}
	};
};

export { adjustSurveyHandler };
