/* eslint-disable no-magic-numbers */
import { closeConnection, connectDb } from '../src/modules/database/connectDatabase';
import request from 'supertest';
import { startServer } from '../src/server';


const { app, server } = startServer();
let creationToken = '';
let CSRFToken = '';
let cookie = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await connectDb({
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		password: process.env.DATABASE_PASSWORD,
		port: Number(process.env.DATABASE_PORT),
		user: process.env.DATABASE_USER,
	});
	const session = await request(app).get('/api/v1/survey/startSession');
	CSRFToken = session.body.CSRFToken;
	cookie = session.headers['set-cookie'];

	const response = await request(app)
		.post('/api/v1/survey/createNew')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			surveyDescription: 'Test Survey',
			surveyName: 'The Test',
		});

	expect(response.statusCode).toBe(201);
	expect(response.body.creationToken).toBeDefined();
	creationToken = response.body.creationToken;
});

afterAll(async () => {
	await request(app)
		.post('/api/v1/survey/removeSurvey')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({ creationToken });
	server.close();
	await closeConnection();
});

test('Returns the previously added options as an array', async () => {
	const response = await request(app)
		.get('/api/v1/manage-survey/getShareLink')
		.query({ creationToken })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(typeof response.body.shareLink).toBe('string');
});

