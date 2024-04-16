import type { Handler } from 'express';
import { buntstift } from 'buntstift';
import { comparePassword } from '../../../modules/protection/hashPassword';
import { getConnection } from '../../../database/connectDatabase';
import { RequestBodyParser } from './request';
import { SelectUserParser } from './selectUser';
import { statusCode } from '../../../modules/misc/statusCodes';
import { signJwtToken } from '../../../modules/protection/jwtHandling';
import { tinyToBoolean } from '../../../database/typecast';

const loginUserHandle = (): Handler => {
	return async (req, res, next) => {
		try {
			const requestBody = RequestBodyParser.parse(req.body);

			const conn = await getConnection();
			const row = await conn.query(
				{
					typeCast: tinyToBoolean,
					sql: `SELECT user_id, email, password, active
						FROM users
						WHERE email = ?`,
				},
				[requestBody.email],
			);

			// If result does not match than there is no user found
			const userFromDb = SelectUserParser.safeParse(row[0]);
			if (!userFromDb.success) {
				buntstift.warn(userFromDb.error.stack || userFromDb.error.message);
				throw new Error('Not Found', { cause: 'User not found' });
			}
			if (!userFromDb.data.active) {
				throw new Error('Forbidden', { cause: 'User accont is disabled' });
			}

			const isValidPassword = await comparePassword(
				requestBody.password,
				userFromDb.data.password,
			);
			if (!isValidPassword) {
				throw new Error('Forbidden', { cause: 'Credentials are wrong' });
			}

			const token = await signJwtToken(userFromDb.data.user_id, 'Creator');
			res.status(statusCode.okay.statusCode).send({ token });
		} catch (error) {
			next(error);
		}
	};
};

export { loginUserHandle };
