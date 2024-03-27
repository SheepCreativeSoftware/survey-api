/* eslint-disable no-magic-numbers */
import { addSurveyToDb, getSurveyIdFromDb, removeSurveyFromDb } from '../../src/database/survey/surveyDb';
import { removeSessionsFromDb, storeSurveyAnswerToDb } from '../../src/database/sessions/sessionsDb';
import { closeConnection } from '../../src/database/connectDatabase';
import { getApi } from '../../src/api/getApi';
import { getToken } from '../../src/modules/misc/createToken';
import { initDatabase } from '../../src/database/initDefaultDatabase';
import { removeOptionsFromDb } from '../../src/database/options/optionsDb';
import request from 'supertest';



const app = getApi();
let creationToken = '';
let publicToken = '';
let surveyId = NaN;

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
	await storeSurveyAnswerToDb({
		optionSelection: ['abc1234', 'abc1337', 'abc1235'],
		surveyId,
	});
	await storeSurveyAnswerToDb({
		optionSelection: ['abc1233', 'abc1332', 'abc1212'],
		surveyId,
	});
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	await closeConnection();
});

test('Respond with the results from the survey', async () => {
	const response = await request(app)
		.get('/api/v1/results/get')
		.query({ creationToken })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);

	for(const result of response.body.surveyResults) {
		expect(typeof result.sessionId).toBe('string');
		expect(Array.isArray(result.optionSelection)).toBe(true);
		for(const selected of result.optionSelection) expect(typeof selected).toBe('string');
	}
});

test('Respond with an error code when token is missing', async () => {
	const response = await request(app)
		.get('/api/v1/results/get')
		.query({ })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});
