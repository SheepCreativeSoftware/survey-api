/* eslint-disable no-magic-numbers */
import { addSurveyToDb, removeSurveyFromDb } from '../../src/database/survey/surveyDb';
import { closeConnection } from '../../src/database/connectDatabase';
import { getApi } from '../../src/api/getApi';
import { getToken } from '../../src/modules/misc/createToken';
import { initDatabase } from '../../src/database/initDefaultDatabase';
import { removeOptionsFromDb } from '../../src/database/options/optionsDb';
import { removeSessionsFromDb } from '../../src/database/sessions/sessionsDb';
import request from 'supertest';



const app = getApi();
let creationToken = '';
let publicToken = '';

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
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	await closeConnection();
});

test('Removes the existing survey', async () => {
	const session = await request(app).get('/api/v1/start-session');

	const response = await request(app)
		.post('/api/v1/survey/remove')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.CSRFToken)
		.set('cookie', session.headers['set-cookie'])
		.send({ creationToken });

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
});

test('Fail to remove without creationToken', async () => {
	const session = await request(app).get('/api/v1/start-session');

	const response = await request(app)
		.post('/api/v1/survey/remove')
		.set('Accept', 'application/json')
		.set('x-csrf-token', session.body.CSRFToken)
		.set('cookie', session.headers['set-cookie'])
		.send({ });

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});

