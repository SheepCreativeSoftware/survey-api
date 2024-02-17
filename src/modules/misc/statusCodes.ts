/* eslint-disable sort-keys */

type StatusObject = {
	status: string,
	statusCode: number,
}

type StatusCodes = 'okay' | 'created' | 'badRequest' | 'forbidden' | 'notFound' | 'internalError'

type StatusCodeObject = {
	[key in StatusCodes]: StatusObject
}

const statusCode: StatusCodeObject = {
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
		statusCode: 403,
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

export { StatusCodeObject, StatusObject, statusCode };
