/* eslint-disable sort-keys */

const statusCode = {
	okay: {
		status: 'OK',
		statusCode: 200,
	},
	created: {
		status: 'Created',
		statusCode: 201,
	},
	badRequest: {
		status: 'Bad request',
		statusCode: 400,
	},
	forbidden: {
		status: 'Forbidden',
		statusCode: 400,
	},
	notFound: {
		status: 'Not found',
		statusCode: 404,
	},
	internalError: {
		status: 'Internal Server Error',
		statusCode: 500,
	},
};

export { statusCode };
