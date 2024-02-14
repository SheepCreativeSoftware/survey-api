// eslint-disable-next-line no-shadow
import { Request, Response } from 'express';
import { buntstift } from 'buntstift';
import express from 'express';
import { expressLogger } from './modules/misc/expressLogger.mjs';

const startServer = () => {
	const app = express();

	// Set path for production or development - Static is not needed in production
	let defaultPath = './';
	if(process.env.NODE_ENV === 'development') {
		defaultPath = './dist/';
		app.use(express.static(defaultPath+'public'));
	}

	// Setup body parser for specific types
	app.use(express.json());


	if(process.env.NODE_ENV === 'production') {
		// Trust first proxy (ngnix)
		app.set('trust proxy', true);
	}


	//app.use('/user', userLoginRouter);

	// Handle Error routes
	app.use(function(req, res) {
		res.status(404).send({
			message: 'Not found',
			statusCode: 404,
		});
	});

	app.use(function(err: Error, req: Request, res: Response) {
		expressLogger('error', req, res);
		if(err.stack) buntstift.error(err.stack);
		res.status(500).send({
			message: 'Bad Request',
			statusCode: 500,
		});
	});

	// Start Server
	app.listen(process.env.PORT).on('listening', () => {
		buntstift.success(`Server started and is listening on Port ${process.env.SERVER_PORT}`);
	}).on('error', (error) => {
		buntstift.error(`Server failed because of ${error.message}`);
	});
};

export { startServer };
