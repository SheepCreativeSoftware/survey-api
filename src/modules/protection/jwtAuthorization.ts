import type { Handler } from 'express';
import { verifyJwtToken } from './jwtHandling';
import { BadRequestException, UnauthorizedException } from '../misc/customErrors';

const jwtAuthorizationHandler = (): Handler => {
	return async (req, _res, next) => {
		let loginStatus = false;
		req.isLoggedIn = () => {
			return loginStatus;
		};

		const authHeader = req.headers.authorization;
		if (typeof authHeader === 'undefined') {
			// No token -> No login
			return next();
		}

		const [authType, token] = authHeader.split(' ');
		if (authType !== 'Bearer') {
			return next(new BadRequestException('Wrong Auth header'));
		}

		try {
			const user = await verifyJwtToken(token);
			req.user = user;
			loginStatus = true;
			next();
		} catch (error) {
			if (error instanceof Error) {
				return next(new UnauthorizedException(`Invalid Token: ${error.message}`));
			}
			next(error);
		}
	};
};

export { jwtAuthorizationHandler };
