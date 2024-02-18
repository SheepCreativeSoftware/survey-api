/* eslint-disable no-magic-numbers */
import { closeConnection } from '../src/modules/database/connectDatabase';
import { initDatabase } from '../src/modules/database/initDefaultDatabase';
import request from 'supertest';
import { startServer } from '../src/server';

const { app, server } = startServer();
let creationToken = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await initDatabase();
});

afterAll(async () => {
	server.close();
	await closeConnection();
});

test('Returns a Creation token string', async () => {
	const session = await request(app).get('/api/v1/survey/startSession');

	const response = await request(app)
		.post('/api/v1/survey/createNew')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.CSRFToken)
		.set('cookie', session.headers['set-cookie'])
		.send({
			choicesType: 'single',
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			surveyDescription: 'Test Survey',
			surveyName: 'The Test',
		});

	expect(response.statusCode).toBe(201);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Created');
	expect(response.body.statusCode).toEqual(201);
	expect(response.body.creationToken).toMatch(/^[A-Za-z0-9+/]*/);
	creationToken = response.body.creationToken;
}, 10_000);

test('Removes the existing survey', async () => {
	const session = await request(app).get('/api/v1/survey/startSession');

	const response = await request(app)
		.post('/api/v1/survey/removeSurvey')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.CSRFToken)
		.set('cookie', session.headers['set-cookie'])
		.send({ creationToken });

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
});

test('Fails without correct data', async () => {
	const session = await request(app).get('/api/v1/survey/startSession');

	const response = await request(app)
		.post('/api/v1/survey/createNew')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.CSRFToken)
		.set('cookie', session.headers['set-cookie'])
		.send({
			creatorName: 6,
			endDate: '2025',
			surveyName: 'The Test',
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});

test('Fails without CSRF token and session cookie', async () => {
	const response = await request(app)
		.post('/api/v1/survey/createNew')
		.set('Accept', 'application/json')
		.send({
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			surveyDescription: 'Test Survey',
			surveyName: 'The Test',
		});

	expect(response.statusCode).toBe(403);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Forbidden');
	expect(response.body.statusCode).toEqual(403);
});
