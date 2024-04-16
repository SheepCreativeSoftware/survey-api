import type { Handler } from 'express';
import { verifyJwtToken } from './jwtHandling';

const jwtAuthorization = (): Handler => {
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
			return next(new Error('Forbidden', { cause: 'Wrong Auth header' }));
		}

		try {
			const user = await verifyJwtToken(token);
			req.user = user;
			loginStatus = true;
		} catch (error) {
			return next(error);
		}
	};
};

export { jwtAuthorization };
