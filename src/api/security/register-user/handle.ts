import type { Handler } from 'express';
import type { ResponseBody } from './response';
import { RequestBodyParser } from './request';
import { newUser } from '../../../domain/user';
import { hashPassword } from '../../../modules/protection/hashPassword';
import { getConnection } from '../../../database/connectDatabase';
import { statusCode } from '../../../modules/misc/statusCodes';

const registerUserHandle = (): Handler => {
	return async (req, res, next) => {
		try {
			const requestBody = RequestBodyParser.parse(req.body);

			const user = newUser();
			user.create({
				email: requestBody.email,
				firstName: requestBody.firstName,
				lastName: requestBody.lastName,
				password: await hashPassword(requestBody.password),
			});

			const conn = await getConnection();
			await conn.query(
				`INSERT INTO users (user_id, first_name, last_name, email, password, active)
				VALUES (?, ?, ?, ?, ?, ?)
			`,
				[
					user.getUserId(),
					user.getFirstName(),
					user.getLastName(),
					user.getEmail(),
					user.getPassword(),
					user.isActive(),
				],
			);

			// TODO: send mail for activation

			const responseBody: ResponseBody = { id: user.getUserId() };

			res.status(statusCode.created.statusCode).send(responseBody);
		} catch (error) {
			next(error);
		}
	};
};

export { registerUserHandle };
