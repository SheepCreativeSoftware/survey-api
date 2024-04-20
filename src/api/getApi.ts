import type { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import {
	clientErrorHandler,
	errorHandler,
	logOnError,
	notFoundHandler,
} from '../modules/handler/errorHandlers';
import { securityRoutes } from './security/router';
import { jwtAuthorizationHandler } from '../modules/protection/jwtAuthorization';
import {
	answererAuthorizedHandler,
	creatorAuthorizedHandler,
	creatorOrAnswererAuthorizedHandler,
	userAuthorizedHandler,
} from '../modules/protection/userAuthCheck';
import { surveyListRouter } from './survey-list/router';
import { answerSurveyRoutes } from './answer/router';
import { surveyResultRoutes } from './survey-result/router';
import { openApiSpecHandler } from './openAPI/handle';

if (typeof process.env.URL === 'undefined') {
	throw new Error('Missing URL enviroment parameter');
}

const url = process.env.URL;

const getApi = (): Application => {
	const app = express();

	// Setup parsers for specific types
	app.use(express.json());
	app.use(cookieParser());

	// Setup basic middlewares
	if (process.env.NODE_ENV === 'production') {
		// Trust first proxy (ngnix)
		app.set('trust proxy', true);
	}

	// Setup cors protection
	app.use(
		cors({
			origin: [url],
			methods: ['GET', 'POST'],
		}),
	);

	app.get('/api/open-api-spec', openApiSpecHandler());

	// Setup user authentification routes and authorization middleware
	app.use(jwtAuthorizationHandler());
	app.use('/api/v1/security', securityRoutes);

	// Setup Protected Routes
	app.use(userAuthorizedHandler());
	app.use('/api/v1/survey-list', creatorAuthorizedHandler(), surveyListRouter);
	app.use('/api/v1/survey-result', creatorOrAnswererAuthorizedHandler(), surveyResultRoutes);
	app.use('/api/v1/answer', answererAuthorizedHandler(), answerSurveyRoutes);

	// Handle errors
	app.use(logOnError);
	app.use(notFoundHandler);
	app.use(clientErrorHandler);
	app.use(errorHandler);

	return app;
};

export { getApi };
