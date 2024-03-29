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
let csrfToken = '';
let cookie = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await initDatabase();
	const session = await request(app).get('/api/v1/start-session');
	csrfToken = session.body.csrfToken;
	cookie = session.headers['set-cookie'];

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

test('Post a answer without a error', async () => {
	const response = await request(app)
		.post('/api/v1/answer/submit')
		.set('Accept', 'application/json')
		.set('x-csrf-token', csrfToken)
		.set('cookie', cookie)
		.send({
			optionSelection: ['abc1234', 'abc1337', 'abc1235'],
			publicToken,
		});

	expect(response.statusCode).toBe(201);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Created');
	expect(response.body.statusCode).toEqual(201);
});

test('Post a answer without token', async () => {
	const response = await request(app)
		.post('/api/v1/answer/submit')
		.set('Accept', 'application/json')
		.set('x-csrf-token', csrfToken)
		.set('cookie', cookie)
		.send({
			optionSelection: ['abc1234', 'abc1337', 'abc1235'],
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});


test('Post a answer with wrong token', async () => {
	const response = await request(app)
		.post('/api/v1/answer/submit')
		.set('Accept', 'application/json')
		.set('x-csrf-token', csrfToken)
		.set('cookie', cookie)
		.send({
			optionSelection: ['abc1234', 'abc1337', 'abc1235'],
			publicToken: 'PqFYEZrLtn_PYjeCaXlkNuaNnTJczwQaDmvZ6Z5DQ1rxpnE-MV-MARINAj7p0B1',
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});
