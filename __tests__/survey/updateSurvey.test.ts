/* eslint-disable no-magic-numbers */
import { addOptionToDb, removeOptionsFromDb } from '../../src/modules/database/options/optionsDb';
import { addSurveyToDb, removeSurveyFromDb } from '../../src/modules/database/survey/surveyDb';
import { closeConnection } from '../../src/modules/database/connectDatabase';
import { getToken } from '../../src/modules/misc/createToken';
import { initDatabase } from '../../src/modules/database/initDefaultDatabase';
import { removeSessionsFromDb } from '../../src/modules/database/sessions/sessionsDb';
import request from 'supertest';
import { startServer } from '../../src/server';


const { app, server } = startServer();
let creationToken = '';
let publicToken = '';
let option1 = '';
let option2 = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await initDatabase();

	creationToken = getToken();
	publicToken = getToken();

	await addSurveyToDb({
		choicesType: 'single',
		creationToken,
		creatorName: 'My Name',
		endDate: new Date('2025-01-01T00:00:00Z'),
		publicToken,
		surveyDescription: 'Test Survey',
		surveyName: 'The Test',
	});
	option1 = await addOptionToDb(creationToken, 'Fangfrage', 'Ist diese Option gut?');
	option2 = await addOptionToDb(creationToken, 'Fangfrage', 'Ist diese Option gut?');
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	server.close();
	await closeConnection();
});

test('Update a exisitng survey', async () => {
	const session = await request(app).get('/api/v1/start-session');

	const response = await request(app)
		.post('/api/v1/survey/update')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.CSRFToken)
		.set('cookie', session.headers['set-cookie'])
		.send({
			choicesType: 'single',
			creationToken,
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			options: [
				{
					content: 'Ist diese Option gut?',
					optionId: option1,
					optionName: 'Fangfrage',
				},
				{
					content: 'Ist diese Option gut?',
					optionId: option2,
					optionName: 'Fangfrage',
				},
			],
			surveyDescription: 'Test Survey',
			surveyName: 'The Test',
		});

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
}, 10_000);

test('Fails with missing data', async () => {
	const session = await request(app).get('/api/v1/start-session');

	const response = await request(app)
		.post('/api/v1/survey/update')
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
		.post('/api/v1/survey/update')
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
