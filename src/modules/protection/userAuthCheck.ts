import { buntstift } from 'buntstift';
import type { Handler } from 'express';

const checkUserAuthorizedHandler = (): Handler => {
	return (req, _res, next) => {
		if (typeof req.isLoggedIn !== 'function') {
			buntstift.error('isLoggedIn is not a function');
			return next(new Error('Internal Server Error'));
		}
		if (req.isLoggedIn() === false) {
			return next(new Error('Unauthorized', { cause: 'User must be logged in' }));
		}

		next();
	};
};

const checkCreatorAuthorizedHandler = (): Handler => {
	return (req, _res, next) => {
		if (req.user?.role === 'Creator') {
			return next();
		}
		return next(new Error('Forbidden', { cause: 'User has no access privilidges' }));
	};
};

const checkAnswererAuthorizedHandler = (): Handler => {
	return (req, _res, next) => {
		if (req.user?.role === 'Answerer') {
			return next();
		}
		return next(new Error('Forbidden', { cause: 'User has no access privilidges' }));
	};
};

export {
	checkAnswererAuthorizedHandler,
	checkCreatorAuthorizedHandler,
	checkUserAuthorizedHandler,
};
