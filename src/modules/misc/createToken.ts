import crypto from 'node:crypto';

const tokenBytes = 48;

const getToken = () => {
	const buffer = crypto.randomBytes(tokenBytes);
	return buffer.toString('base64url');
};

export { getToken };
