import { getToken } from './createToken';

test('returns a base64url token string', () => {
	expect(getToken()).toMatch(/^[A-Za-z0-9+/]*/);
	expect(typeof getToken()).toBe('string');
});
