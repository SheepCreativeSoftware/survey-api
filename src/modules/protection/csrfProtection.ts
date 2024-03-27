import { doubleCsrf } from 'csrf-csrf';

if (typeof process.env.SESSION_SECRET === 'undefined') {
	throw new Error('Missing Session Secret');
}

const csrfProtection = doubleCsrf({
	cookieName: `${process.env.HOST}.x-csrf-token`,
	cookieOptions: {
		maxAge: 600_000,
		path: '/',
		sameSite: 'lax',
		secure: true,
	},
	getSecret: () => process.env.SESSION_SECRET || 'WillFailOnUndefined',
	getTokenFromRequest: req => req.headers['x-csrf-token'],
	ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
	size: 64,
});

export { csrfProtection };
