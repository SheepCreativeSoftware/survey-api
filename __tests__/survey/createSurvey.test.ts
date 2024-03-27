import { closeConnection } from '../../src/database/connectDatabase';
import { getApi } from '../../src/api/getApi';
import { initDatabase } from '../../src/database/initDefaultDatabase';
import { removeOptionsFromDb } from '../../src/database/options/optionsDb';
import { removeSessionsFromDb } from '../../src/database/sessions/sessionsDb';
import { removeSurveyFromDb } from '../../src/database/survey/surveyDb';
import request from 'supertest';


const app = getApi();
let creationToken = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await initDatabase();
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	await closeConnection();
});

test('Creates a survey and returns a Creation token string', async () => {
	const session = await request(app).get('/api/v1/start-session');
	console.log(session.body);
	

	const response = await request(app)
		.post('/api/v1/survey/submit')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.csrfToken)
		.set('cookie', session.headers['set-cookie'])
		.send({
			choicesType: 'single',
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			options: [
				{
					content: 'Ist diese Option gut?',
					optionName: 'Fangfrage',
				},
				{
					content: 'Ist diese Option gut?',
					optionName: 'Fangfrage',
				},
			],
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

test('Fails with missing data', async () => {
	const session = await request(app).get('/api/v1/start-session');

	const response = await request(app)
		.post('/api/v1/survey/submit')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.csrfToken)
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
		.post('/api/v1/survey/submit')
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
