import type { Handler } from 'express';
import type { ResponseBody } from './response';
import { getConnection } from '../../../database/connectDatabase';
import { newOption } from '../../../domain/option';
import { newSurvey } from '../../../domain/survey';
import { RequestBodyParser } from './request';
import { UnauthorizedException } from '../../../modules/misc/customErrors';

const createSurveyHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (req.user?.role === 'Answerer' || typeof req.user?.userId === 'undefined') {
				throw new UnauthorizedException('User is not logged in');
			}
			const { userId } = req.user;

			const requestBody = RequestBodyParser.parse(req.body);

			const survey = newSurvey();
			survey.create({
				choicesType: requestBody.choicesType,
				endDate: new Date(requestBody.endDate),
				surveyDescription: requestBody.surveyDescription,
				surveyName: requestBody.surveyName,
			});

			const conn = await getConnection();
			await conn.query(
				`INSERT INTO survey
				(user_id, survey_id, survey_name, survey_description, choices_type, end_date, created, completed)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					userId,
					survey.getSurveyId(),
					survey.getSurveyName(),
					survey.getSurveyDescription(),
					survey.getChoicesType(),
					survey.getEndDate(),
					survey.getCreated(),
					survey.isCompleted(),
				],
			);

			const responseBody: ResponseBody = {
				surveyId: survey.getSurveyId(),
				options: [],
			};

			if (requestBody.options.length > 0) {
				// Construct a single query for multiple options
				const sqlValueParameter = '(?, ?, ?, ?)';
				let sqlMultipleValueParameters = '';
				// biome-ignore lint/suspicious/noExplicitAny: Could be multiple different things
				const values: any[] = [];
				for (let index = 0; index < requestBody.options.length; index++) {
					const option = newOption();
					option.create({
						content: requestBody.options[index].content,
						optionName: requestBody.options[index].optionName,
					});

					values.push(
						...[
							survey.getSurveyId(),
							option.getOptionId(),
							option.getOptionName(),
							option.getContent(),
						],
					);

					responseBody.options.push({ optionId: option.getOptionId() });

					// No comma for the last parameter
					if (index < requestBody.options.length - 1) {
						sqlMultipleValueParameters += `${sqlValueParameter}, `;
					} else {
						sqlMultipleValueParameters += `${sqlValueParameter}`;
					}
				}

				await conn.query(
					`INSERT INTO options
					(survey_id, option_id, option_name, content)
					VALUES ${sqlMultipleValueParameters}`,
					values,
				);
			}

			res.status(201).send(responseBody);
		} catch (error) {
			next(error);
		}
	};
};

export { createSurveyHandler };
