/* eslint-disable  */
import request from 'supertest';
import { startServer } from '../src/server';
import { connectDb, getConnection } from '../src/modules/database/connectDatabase';

const { app, server } = startServer();

beforeAll(async () => {
	const conn = await connectDb({

		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		password: process.env.DATABASE_PASSWORD,
		port: Number(process.env.DATABASE_PORT),
		user: process.env.DATABASE_USER,
	});
})
afterAll(async () => {
	server.close()
	const conn = await getConnection();
	conn.destroy();
});

test('Returns a Creation token string', async () => {
	const session = await request(app).get('/api/v1/startSession');
	const response = await request(app).
		post('/api/v1/createNew').
		set('Accept', 'application/json').
		set('x-csrf-token', session.body.CSRFToken).
		set('cookie', session.headers['set-cookie']).
		send({
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			surveyDescription: 'Test Survey',
			surveyName: 'The Test',
		});
			
	expect(response.statusCode).toBe(201);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Created');
	expect(response.body.statusCode).toEqual(201);
	expect(typeof response.body.creationToken).toEqual('string');
	expect(response.body.creationToken).toMatch(/^[A-Za-z0-9+/]*/);
});
