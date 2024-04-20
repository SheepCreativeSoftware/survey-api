import type { UUID } from 'node:crypto';
import { buntstift } from 'buntstift';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

if (typeof process.env.SESSION_SECRET === 'undefined') {
	throw new Error('Missing SESSION_SECRET enviroment variable');
}
const secretKey = process.env.SESSION_SECRET;

type Payload =
	| {
			role: 'Creator';
	  }
	| {
			role: 'Answerer';
			surveyId: UUID;
			endDate: string;
			exp: number;
	  };

const signJwtToken = (
	options:
		| { role: 'Creator'; userId: UUID | string }
		| { role: 'Answerer'; surveyId: UUID; endDate: Date },
): Promise<string> => {
	const payload = {
		role: options.role,
	} as Payload;

	const signOptions: jwt.SignOptions = {
		algorithm: 'HS256',
		issuer: process.env.HOST,
		jwtid: crypto.randomUUID(),
	};

	// Check both otherwise typescript will not understand
	if (options.role === 'Answerer' && payload.role === 'Answerer') {
		payload.surveyId = options.surveyId;
		payload.endDate = options.endDate.toISOString();

		// Expiration of Answerer token is based on the end of a survey + 14 days
		payload.exp = options.endDate.getTime() / 1000 + 14 * 24 * 60 * 60;
	}

	if (options.role === 'Creator' && payload.role === 'Creator') {
		signOptions.expiresIn = '30m';
		signOptions.subject = options.userId;
	}
	return new Promise((resolve, reject) => {
		jwt.sign(payload, secretKey, signOptions, (err, jwt) => {
			if (err) {
				buntstift.error(err.message);
				return reject(err);
			}

			if (typeof jwt === 'string') {
				resolve(jwt);
			}

			reject(new Error('JWT is not a string'));
		});
	});
};

// biome-ignore lint/correctness/noUndeclaredVariables: Is defined globaly in global.d.ts
const verifyJwtToken = (token: string): Promise<Express.User> => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secretKey, { issuer: process.env.HOST }, (err, payload) => {
			if (err) {
				buntstift.error(err.message);
				return reject(err);
			}
			if (typeof payload === 'undefined' || typeof payload === 'string') {
				return reject(new Error('JWT is not an object'));
			}

			if (payload.role === 'Creator') {
				return resolve({
					role: payload.role,
					userId: payload.sub as UUID,
				});
			}

			if (payload.role === 'Answerer') {
				return resolve({
					role: payload.role,
					surveyId: payload.surveyId,
					endDate: payload.endDate,
					answererId: payload.jti as UUID,
				});
			}
		});
	});
};

export { signJwtToken, verifyJwtToken };
