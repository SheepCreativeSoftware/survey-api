/* eslint-disable  */
import request from 'supertest';
import { startServer } from '../src/server';

const { app, server} = startServer();
afterAll(() => server.close());

test('Returns a CSRF token string', async () => {
	const response = await request(app).get('/api/v1/startSession')
	expect(response.statusCode).toBe(201);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Created');
	expect(response.body.statusCode).toEqual(201);
	expect(typeof response.body.CSRFToken).toEqual('string');
});
