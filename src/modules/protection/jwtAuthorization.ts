import type { Handler } from 'express';
import { verifyJwtToken } from './jwtHandling';

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
			return next(new Error('Bad Request', { cause: 'Wrong Auth header' }));
		}

		try {
			const user = await verifyJwtToken(token);
			req.user = user;
			loginStatus = true;
			next();
		} catch (error) {
			if (error instanceof Error) {
				return next(
					new Error('Unauthorized', { cause: `Invalid Token: ${error.message}` }),
				);
			}
			next(error);
		}
	};
};

export { jwtAuthorizationHandler };
