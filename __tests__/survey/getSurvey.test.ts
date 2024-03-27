/* eslint-disable no-magic-numbers */
import { addOptionToDb, removeOptionsFromDb } from '../../src/database/options/optionsDb';
import { addSurveyToDb, getSurveyIdFromDb, removeSurveyFromDb } from '../../src/database/survey/surveyDb';
import { closeConnection } from '../../src/database/connectDatabase';
import { getApi } from '../../src/api/getApi';
import { getToken } from '../../src/modules/misc/createToken';
import { initDatabase } from '../../src/database/initDefaultDatabase';
import { removeSessionsFromDb } from '../../src/database/sessions/sessionsDb';
import request from 'supertest';


const app = getApi();
let creationToken = '';
let publicToken = '';
let surveyId = NaN;
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
	surveyId = await getSurveyIdFromDb({ creationToken });
	option1 = await addOptionToDb(creationToken, 'Fangfrage', 'Ist diese Option gut?');
	option2 = await addOptionToDb(creationToken, 'Fangfrage', 'Ist diese Option gut?');
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	await closeConnection();
});

test('Respond with the content from the survey', async () => {
	const response = await request(app)
		.get('/api/v1/survey/get')
		.query({ creationToken })
		.set('Accept', 'application/json');

	expect(response.statusCode).toEqual(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(response.body.surveyId).toEqual(surveyId);
	expect(response.body.choicesType).toEqual('single');
	expect(response.body.creatorName).toEqual('My Name');
	expect(response.body.endDate).toEqual(new Date('2025-01-01T00:00:00Z').toISOString());
	expect(response.body.surveyDescription).toEqual('Test Survey');
	expect(response.body.surveyName).toEqual('The Test');

	expect(response.body.options[0].content).toBe('Ist diese Option gut?');
	expect(response.body.options[0].optionName).toBe('Fangfrage');
	expect(response.body.options[0].optionId).toBe(option1);
	expect(response.body.options[1].content).toBe('Ist diese Option gut?');
	expect(response.body.options[1].optionName).toBe('Fangfrage');
	expect(response.body.options[1].optionId).toBe(option2);
});

test('Returns an error with missing token', async () => {
	const response = await request(app)
		.get('/api/v1/survey/get')
		.query({ })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});
