import cookieParser from 'cookie-parser';
import cors from 'cors';
import type { Application } from 'express';
import express from 'express';
import {
	clientErrorHandler,
	errorHandler,
	logOnError,
	notFoundHandler,
} from '../modules/handler/errorHandlers';
import { answerRoutes } from './answer/router';
import { publicRoutes } from './public/router';
import { resultsRoutes } from './results/router';
import { securityRoutes } from './security/router';
import { jwtAuthorizationHandler } from '../modules/protection/jwtAuthorization';
import {
	answererAuthorizedHandler,
	creatorAuthorizedHandler,
	userAuthorizedHandler,
} from '../modules/protection/userAuthCheck';
import { surveyListRouter } from './survey-list/router';

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
			origin: process.env.URL,
		}),
	);

	// Setup user authentification routes and authorization middleware
	app.use('/api/v1/security', securityRoutes);
	app.use(jwtAuthorizationHandler());

	// Setup Protected Routes
	//app.use('/api/v1/', publicRoutes);
	app.use(userAuthorizedHandler());
	app.use('/api/v1/survey-list', creatorAuthorizedHandler(), surveyListRouter);
	//app.use('/api/v1/survey', surveyRoutes);
	//app.use('/api/v1/results', userAuthorizedHandler(), resultsRoutes);
	//app.use('/api/v1/answer', answererAuthorizedHandler(), answerRoutes);

	// Handle errors
	app.use(logOnError);
	app.use(notFoundHandler);
	app.use(clientErrorHandler);
	app.use(errorHandler);

	return app;
};

export { getApi };
