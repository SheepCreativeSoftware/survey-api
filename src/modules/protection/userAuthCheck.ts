import { buntstift } from 'buntstift';
import type { Handler } from 'express';
import { ForbiddenException, UnauthorizedException } from '../misc/customErrors';

const userAuthorizedHandler = (): Handler => {
	return (req, _res, next) => {
		if (typeof req.isLoggedIn !== 'function') {
			buntstift.error('isLoggedIn is not a function');
			return next(new Error('Internal Server Error'));
		}
		if (req.isLoggedIn() === false) {
			return next(new UnauthorizedException('User must be logged in'));
		}

		next();
	};
};

const creatorAuthorizedHandler = (): Handler => {
	return (req, _res, next) => {
		if (req.user?.role === 'Creator') {
			return next();
		}
		return next(new ForbiddenException('User has no access privilidges'));
	};
};

const answererAuthorizedHandler = (): Handler => {
	return (req, _res, next) => {
		if (req.user?.role === 'Answerer') {
			return next();
		}
		return next(new ForbiddenException('User has no access privilidges'));
	};
};

const creatorOrAnswererAuthorizedHandler = (): Handler => {
	return (req, _res, next) => {
		if (req.user?.role === 'Answerer' || req.user?.role === 'Creator') {
			return next();
		}
		return next(new ForbiddenException('User has no access privilidges'));
	};
};

export {
	answererAuthorizedHandler,
	creatorAuthorizedHandler,
	creatorOrAnswererAuthorizedHandler,
	userAuthorizedHandler,
};
