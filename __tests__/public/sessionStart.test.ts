/* eslint-disable no-magic-numbers */
import request from 'supertest';
import { startServer } from '../../src/server';

const { app, server } = startServer();
afterAll(() => server.close());

test('Returns a CSRF token string', async () => {
	const response = await request(app).get('/api/v1/start-session');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(typeof response.body.CSRFToken).toEqual('string');
});

test('Retruns a not found response in case the route is unkown', async () => {
	const response = await request(app).get('/apple/route');

	expect(response.statusCode).toBe(404);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Not Found');
	expect(response.body.statusCode).toEqual(404);
});

