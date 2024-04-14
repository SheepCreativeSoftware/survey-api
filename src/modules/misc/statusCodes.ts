type StatusObject = {
	status: string;
	statusCode: number;
};

type StatusCodes =
	| 'okay'
	| 'created'
	| 'conflict'
	| 'badRequest'
	| 'forbidden'
	| 'notFound'
	| 'internalError';

type StatusCodeObject = {
	[Key in StatusCodes]: StatusObject;
};

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
		status: 'Bad Request',
		statusCode: 400,
	},
	forbidden: {
		status: 'Forbidden',
		statusCode: 403,
	},
	notFound: {
		status: 'Not Found',
		statusCode: 404,
	},
	conflict: {
		status: 'Conflict',
		statusCode: 409,
	},
	internalError: {
		status: 'Internal Server Error',
		statusCode: 500,
	},
};

export type { StatusCodeObject, StatusObject };
export { statusCode };
