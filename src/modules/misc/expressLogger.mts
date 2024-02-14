// eslint-disable-next-line no-shadow
import { Request, Response } from 'express';
import { buntstift } from 'buntstift';

const expressLogger = (type: 'success' | 'warn' | 'error' | 'verbose' | 'info', req: Request, res: Response) => {
	const message = `[${new Date().toUTCString()}] - IP: ${req.hostname} - Code: ${res.statusCode} - Requested: ${req.method} ${req.url}`;
	switch (type) {
	case 'success':
		buntstift.success(message);
		break;
	case 'warn':
		buntstift.warn(message);
		break;
	case 'error':
		buntstift.error(message);
		break;
	case 'verbose':
		buntstift.verbose(message);
		break;
	case 'info':
		buntstift.info(message);
		break;
	default:
		break;
	}
};

export { expressLogger };
