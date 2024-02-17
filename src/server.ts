import { clientErrorHandler, errorHandler, notFoundHandler } from './modules/misc/errorHandlers.js';
import { buntstift } from 'buntstift';
import cookieParser from 'cookie-parser';
import { defaultRoutes } from './modules/routes/defaultRoutes.js';
import { doubleCsrf } from 'csrf-csrf';
import express from 'express';


const startServer = () => {
	const app = express();

	// Setup parsers for specific types
	app.use(express.json());
	app.use(cookieParser());

	// Setup basic middlewares
	if(typeof process.env.SESSION_SECRET === 'undefined') throw new Error('Missing Session Secret');
	if(process.env.NODE_ENV === 'production') {
		// Trust first proxy (ngnix)
		app.set('trust proxy', true);
	}

	const csrfProtection = doubleCsrf({
		cookieName: `${process.env.HOST}.x-csrf-token`,
		cookieOptions: {
			maxAge: 600_000,
			path: '/',
			sameSite: 'lax',
			secure: true,
		},
		getSecret: () => process.env.SESSION_SECRET || 'WillFailOnUndefined',
		getTokenFromRequest: (req) => req.headers['x-csrf-token'],
		ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
		size: 64,
	});

	// Setup CSRF protection
	app.use(csrfProtection.doubleCsrfProtection);

	// Setup Protected Routes
	app.use('/api/v1', defaultRoutes);

	// Handle errors
	app.use(notFoundHandler);
	app.use(clientErrorHandler);
	app.use(errorHandler);

	// Start Server
	app.listen(process.env.PORT).on('listening', () => {
		buntstift.success(`Server started and is listening on Port ${process.env.PORT}`);
	}).on('error', (error) => {
		buntstift.error(`Server failed because of ${error.message}`);
	});
};

export { startServer };
