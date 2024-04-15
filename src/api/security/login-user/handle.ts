import type { Handler } from 'express';
import type { ResponseBody } from './response';
import type { SignOptions } from 'jsonwebtoken';
import { comparePassword } from '../../../modules/protection/hashPassword';
import { getConnection } from '../../../database/connectDatabase';
import { RequestBodyParser } from './request';
import { SelectUserParser } from './selectUser';
import { statusCode } from '../../../modules/misc/statusCodes';
import jwt from 'jsonwebtoken';

const signOptions: SignOptions = {
	algorithm: 'RS256',
	expiresIn: '30m',
	issuer: process.env.HOST,
};

const loginUserHandle = (): Handler => {
	return async (req, res, next) => {
		try {
			const requestBody = RequestBodyParser.parse(req.body);

			const conn = await getConnection();
			const row = await conn.query(
				`
				SELECT user_id, email, password, active
				FROM users
				WHERE email = ?
			`,
				[requestBody.email],
			);

			const userFromDb = SelectUserParser.safeParse(row[0]);
			if (!userFromDb.success) {
				throw new Error('Not Found', { cause: 'User not found' });
			}
			if (!userFromDb.data.active) {
				throw new Error('Forbidden', { cause: 'User is not active' });
			}

			const isValidPassword = comparePassword(requestBody.password, userFromDb.data.password);
			if (!isValidPassword) {
				throw new Error('Forbidden', { cause: 'Credentials are wrong' });
			}
			if (typeof process.env.SESSION_SECRET === 'undefined') {
				throw new Error('Internal Server Error', {
					cause: 'Missing SESSION_SECRET enviroment variable',
				});
			}

			jwt.sign(
				{ userId: userFromDb.data.user_id },
				process.env.SESSION_SECRET,
				signOptions,
				(err, jwt) => {
					if (err) {
						return next(
							new Error('Internal Server Error', {
								cause: 'Failed to generate JWT token',
							}),
						);
					}

					if (typeof req.csrfToken === 'undefined') {
						return next(
							new Error('Internal Server Error', {
								cause: 'Failed to generate CSRF Token',
							}),
						);
					}

					const responseBody: ResponseBody = { csrfToken: req.csrfToken() };
					res.cookie('jwt', jwt);
					res.status(statusCode.okay.statusCode).send(responseBody);
				},
			);
		} catch (error) {
			next(error);
		}
	};
};

export { loginUserHandle };
