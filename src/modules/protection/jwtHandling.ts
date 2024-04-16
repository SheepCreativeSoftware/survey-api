import type { UUID } from 'node:crypto';
import { buntstift } from 'buntstift';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

if (typeof process.env.SESSION_SECRET === 'undefined') {
	throw new Error('Missing SESSION_SECRET enviroment variable');
}
const secretKey = process.env.SESSION_SECRET;

const signJwtToken = (subject: string, role: 'Creator' | 'Answerer'): Promise<string> => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{
				role,
			},
			secretKey,
			{
				algorithm: 'HS256',
				expiresIn: '30m',
				issuer: process.env.HOST,
				jwtid: crypto.randomUUID(),
				subject,
			},
			(err, jwt) => {
				if (err) {
					buntstift.error(err.message);
					return reject(err);
				}

				if (typeof jwt === 'string') {
					resolve(jwt);
				}

				reject(new Error('JWT is not a string'));
			},
		);
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

			if (typeof payload.sub !== 'string') {
				return reject(new Error('JWT sub is malformed'));
			}

			if (typeof payload.role !== 'string') {
				return reject(new Error('JWT role is malformed'));
			}

			// biome-ignore lint/correctness/noUndeclaredVariables: Is defined globaly in global.d.ts
			const result: Express.User = {
				role: payload.role as 'Creator' | 'Answerer',
				userId: payload.sub as UUID,
			};

			resolve(result);
		});
	});
};

export { signJwtToken, verifyJwtToken };
