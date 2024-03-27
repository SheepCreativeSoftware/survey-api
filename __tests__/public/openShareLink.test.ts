/* eslint-disable no-magic-numbers */
import { addOptionToDb, removeOptionsFromDb } from '../../src/database/options/optionsDb';
import { addSurveyToDb, removeSurveyFromDb } from '../../src/database/survey/surveyDb';
import { closeConnection } from '../../src/database/connectDatabase';
import { getApi } from '../../src/api/getApi';
import { getToken } from '../../src/modules/misc/createToken';
import { initDatabase } from '../../src/database/initDefaultDatabase';
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

	await addOptionToDb(creationToken, 'Fangfrage', 'Ist diese Option gut?');
	await addOptionToDb(creationToken, 'Fangfrage', 'Ist diese Option gut?');
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	await closeConnection();
});

test('Returns the shared survey from with the public token', async () => {
	const response = await request(app)
		.get('/api/v1/open-share')
		.query({ publicToken })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(response.body.surveyName).toEqual('The Test');
	expect(response.body.surveyDescription).toEqual('Test Survey');

	expect(response.body.choicesType).toEqual('single');
	expect(response.body.creatorName).toEqual('My Name');
	expect(response.body.endDate).toEqual(new Date('2025-01-01T00:00:00Z').toISOString());

	for(const option of response.body.options) {
		expect(option.content).toBe('Ist diese Option gut?');
		expect(option.optionName).toBe('Fangfrage');
		expect(typeof option.optionId).toBe('string');
	}
}, 10_000);

test('Returns an error with missing token', async () => {
	const response = await request(app)
		.get('/api/v1/open-share')
		.query({ })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});

test('Returns an error with wrong token', async () => {
	const response = await request(app)
		.get('/api/v1/open-share')
		.query({ publicToken: 'PqFYEZrLtn_PYjeCaXlkNuaNnTJczwQaDmvZ6Z5DQ1rxpnE-MV-MARINAj7p0B1' })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});
