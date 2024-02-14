// eslint-disable-next-line no-shadow
import { Request, Response } from 'express';
import { buntstift } from 'buntstift';
import { createSurvey } from './modules/routes/createSurvey.mjs';
import express from 'express';
import { expressLogger } from './modules/misc/expressLogger.mjs';
import { statusCode } from './modules/misc/statusCodes.mjs';


const startServer = () => {
	const app = express();

	// Setup body parser for specific types
	app.use(express.json());

	if(process.env.NODE_ENV === 'production') {
		// Trust first proxy (ngnix)
		app.set('trust proxy', true);
	}

	// Setup Routes
	app.use('/api/v1', createSurvey);

	// Handle Error routes
	app.use(function(req, res) {
		res.status(statusCode.notFound.statusCode).send(statusCode.notFound);
	});

	app.use(function(err: Error, req: Request, res: Response) {
		expressLogger('error', req, res);
		if(err.stack) buntstift.error(err.stack);
		res.status(statusCode.badRequest.statusCode).send(statusCode.badRequest);
	});

	// Start Server
	app.listen(process.env.PORT).on('listening', () => {
		buntstift.success(`Server started and is listening on Port ${process.env.PORT}`);
	}).on('error', (error) => {
		buntstift.error(`Server failed because of ${error.message}`);
	});
};

export { startServer };
