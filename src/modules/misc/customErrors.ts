class NetworkException extends Error {
	statusCode: number;
	constructor(statusCode: number, message?: string, options?: ErrorOptions) {
		super(message, options);
		this.statusCode = statusCode;
	}
}

class BadRequestException extends NetworkException {
	constructor(message?: string, options?: ErrorOptions) {
		super(400, message, options);
		this.name = 'Bad Request';
	}
}

class UnauthorizedException extends NetworkException {
	constructor(message?: string, options?: ErrorOptions) {
		super(401, message, options);
		this.name = 'Unauthorized';
	}
}

class ForbiddenException extends NetworkException {
	constructor(message?: string, options?: ErrorOptions) {
		super(403, message, options);
		this.name = 'Forbidden';
	}
}

class NotFoundException extends NetworkException {
	constructor(message?: string, options?: ErrorOptions) {
		super(404, message, options);
		this.name = 'Not Found';
	}
}

class ConflictException extends NetworkException {
	constructor(message?: string, options?: ErrorOptions) {
		super(409, message, options);
		this.name = 'Conflict';
	}
}

class InternalServerException extends NetworkException {
	constructor(message?: string, options?: ErrorOptions) {
		super(500, message, options);
		this.name = 'Internal Server Error';
	}
}

export {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	InternalServerException,
	NetworkException,
	NotFoundException,
	UnauthorizedException,
};
