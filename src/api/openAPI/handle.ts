import type { Handler } from 'express';
import path from 'node:path';

const openApiSpecHandler = (): Handler => {
	return (_req, res, next) => {
		try {
			const openApiFilePath = path.join(__dirname, '..', '..', '..', 'swagger.yaml');

			res.status(200).sendFile(openApiFilePath);
		} catch (error) {
			next(error);
		}
	};
};

export { openApiSpecHandler };
