import type { Handler } from 'express';
import type { ResponseBody } from './response';
import { ConflictException } from '../../../modules/misc/customErrors';
import { getConnection } from '../../../database/connectDatabase';
import { hashPassword } from '../../../modules/protection/hashPassword';
import { newUser } from '../../../domain/user';
import { RequestBodyParser } from './request';
import { SqlError } from 'mariadb';

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

			// Activate directly as long as there is no activation route
			user.activate();

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

			res.status(201).send(responseBody);
		} catch (error) {
			if (error instanceof SqlError) {
				return next(new ConflictException('Account might already exists'));
			}
			next(error);
		}
	};
};

export { registerUserHandle };
