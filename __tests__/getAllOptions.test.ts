/* eslint-disable no-magic-numbers */
import { closeConnection } from '../src/modules/database/connectDatabase';
import { initDatabase } from '../src/modules/database/initDefaultDatabase';
import request from 'supertest';
import { startServer } from '../src/server';



const { app, server } = startServer();
let creationToken = '';
let CSRFToken = '';
let cookie = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await initDatabase();
	const session = await request(app).get('/api/v1/survey/startSession');
	CSRFToken = session.body.CSRFToken;
	cookie = session.headers['set-cookie'];

	const response = await request(app)
		.post('/api/v1/survey/createNew')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			choicesType: 'single',
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			surveyDescription: 'Test Survey',
			surveyName: 'The Test',
		});

	expect(response.statusCode).toBe(201);
	expect(response.body.creationToken).toBeDefined();
	creationToken = response.body.creationToken;

	await request(app)
		.post('/api/v1/manage-survey/addOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			content: 'Ist diese Option gut?',
			creationToken,
			optionName: 'Fangfrage',
		});

	await request(app)
		.post('/api/v1/manage-survey/addOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			content: 'Ist diese Option gut?',
			creationToken,
			optionName: 'Fangfrage',
		});
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
		.get('/api/v1/manage-survey/getAllOptions')
		.query({ creationToken })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);

	for(const option of response.body.options) {
		expect(option.content).toBe('Ist diese Option gut?');
		expect(option.optionName).toBe('Fangfrage');
		expect(typeof option.optionId).toBe('string');
	}
});

