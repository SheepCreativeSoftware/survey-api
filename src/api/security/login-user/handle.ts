import type { Handler } from 'express';
import crypto from 'node:crypto';
import { comparePassword } from '../../../modules/protection/hashPassword';
import { getConnection } from '../../../database/connectDatabase';
import { RequestBodyParser } from './request';
import { SelectUserParser } from './selectUser';
import { statusCode } from '../../../modules/misc/statusCodes';
import jwt from 'jsonwebtoken';

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

			const isValidPassword = await comparePassword(requestBody.password, userFromDb.data.password);
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
				{
					algorithm: 'HS256',
					expiresIn: '30m',
					issuer: process.env.HOST,
					jwtid: crypto.randomUUID(),
				},
				(err, jwt) => {
					if (err) {
						console.log(err);
						
						return next(
							new Error('Internal Server Error', {
								cause: 'Failed to generate JWT token',
							}),
						);
					}

					res.status(statusCode.okay.statusCode).send({ jwt });
				},
			);
		} catch (error) {
			next(error);
		}
	};
};

export { loginUserHandle };
