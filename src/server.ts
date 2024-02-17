import { clientErrorHandler, errorHandler, notFoundHandler } from './modules/handler/errorHandlers.js';
import { buntstift } from 'buntstift';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { csrfProtection } from './modules/protection/csrfProtection.js';
import { defaultRoutes } from './modules/routes/defaultRoutes.js';
import express from 'express';



const startServer = () => {
	const app = express();

	// Setup parsers for specific types
	app.use(express.json());
	app.use(cookieParser());

	// Setup basic middlewares
	if(process.env.NODE_ENV === 'production') {
		// Trust first proxy (ngnix)
		app.set('trust proxy', true);
	}

	// Setup protection
	app.use(cors());
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
