// eslint-disable-next-line no-shadow
import crypto from 'crypto';

const tokenBytes = 48;

const getToken = () => {
	const buffer = crypto.randomBytes(tokenBytes);
	return buffer.toString('base64url');
};

export { getToken };
