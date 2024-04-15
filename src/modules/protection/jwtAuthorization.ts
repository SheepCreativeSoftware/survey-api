import type { UUID } from 'node:crypto';
import type { Handler } from 'express';
import jwt from 'jsonwebtoken';
import { getConnection } from '../../database/connectDatabase';
import { z as zod } from 'zod';

const SelectUserParser = zod.object({
	user_id: zod.string().uuid(),
	email: zod.string(),
	first_name: zod.string(),
	last_name: zod.string(),
	active: zod.boolean(),
});

const getUserById = async (userId: UUID) => {
	const conn = await getConnection();
	const row = await conn.query(
		`
		SELECT user_id, email, first_name, last_name, active
		FROM users
		WHERE user_id = ?
	`,
		[userId],
	);

	const userFromDb = SelectUserParser.safeParse(row[0]);
	if (!userFromDb.success) {
		throw new Error('Not Found', { cause: 'User not found' });
	}
	if (!userFromDb.data.active) {
		throw new Error('Forbidden', { cause: 'User is not active' });
	}

	return userFromDb.data;
}

const jwtAuthorization = (): Handler => {
	return (req, _res, next) => {
		const authHeader = req.headers.authorization;
		if (typeof authHeader === 'undefined') {
			return next(new Error('Forbidden', { cause: 'Missing Auth header' }));
		}

		const [authType, token] = authHeader.split(' ');
		if(authType !== 'Bearer') {
			return next(new Error('Forbidden', { cause: 'Wrong Auth header' }));
		}

		if (typeof process.env.SESSION_SECRET === 'undefined') {
			throw new Error('Internal Server Error', {
				cause: 'Missing SESSION_SECRET enviroment variable',
			});
		}

		jwt.verify(token, process.env.SESSION_SECRET, { issuer: process.env.HOST }, async (err, token) => {
			try {
				if (err) {
					throw new Error('Forbidden', {
						cause: 'Failed to verify token',
					});
				}
				if(typeof token === 'undefined' || typeof token === "string") {
					throw new Error('Internal Server Error', {
						cause: 'JWT Token has wrong format',
					});
				}

				const userId = token.userId;
				const user = await getUserById(userId);

				req.user = {
					email: user.email,
					firstName: user.first_name,
					lastName: user.last_name,
					userId: user.user_id as UUID,
				};
				next();
			} catch (error) {
				return next(error);
			}
		});
	};
};

export { jwtAuthorization };
