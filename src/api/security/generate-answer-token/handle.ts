import type { Handler } from 'express';
import type { UUID } from 'node:crypto';
import {
	InternalServerException,
	NotFoundException,
	UnauthorizedException,
} from '../../../modules/misc/customErrors';
import { buntstift } from 'buntstift';
import { getConnection } from '../../../database/connectDatabase';
import { RequestQueryParser } from './request';
import { SelectSurveyParser } from './sqlValidation';
import { signJwtToken } from '../../../modules/protection/jwtHandling';

const generateAnswerTokenHandler = (): Handler => {
	return async (req, res, next) => {
		try {
			if (req.user?.role === 'Answerer' || typeof req.user?.userId === 'undefined') {
				throw new UnauthorizedException('User is not logged in');
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
				throw new NotFoundException();
			}

			const dataFromDb = SelectSurveyParser.safeParse(response);
			if (!dataFromDb.success) {
				buntstift.error(dataFromDb.error.message);
				throw new InternalServerException();
			}

			const { data } = dataFromDb;

			const token = await signJwtToken({
				role: 'Answerer',
				endDate: data[0].endDate,
				surveyId: data[0].surveyId as UUID,
			});

			res.status(200).send({ token });
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
