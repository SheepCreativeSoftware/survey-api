/* eslint-disable no-magic-numbers */
import { addSurveyToDb, getSurveyIdFromDb, removeSurveyFromDb } from '../src/modules/database/survey/surveyDb';
import { closeConnection } from '../src/modules/database/connectDatabase';
import { getToken } from '../src/modules/misc/createToken';
import { initDatabase } from '../src/modules/database/initDefaultDatabase';
import { removeOptionsFromDb } from '../src/modules/database/options/optionsDb';
import { removeSessionsFromDb } from '../src/modules/database/sessions/sessionsDb';
import request from 'supertest';
import { startServer } from '../src/server';


const { app, server } = startServer();
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
	surveyId = await getSurveyIdFromDb(creationToken);
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	server.close();
	await closeConnection();
});

test('Respond with the results from the survey', async () => {
	const response = await request(app)
		.get('/api/v1/manage-survey/getFullSurvey')
		.query({ creationToken })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(response.body.surveyId).toBe(surveyId);
	expect(response.body.choicesType).toBe('single');
	expect(response.body.creatorName).toBe('My Name');
	expect(response.body.endDate).toBe(new Date('2025-01-01T00:00:00Z').toISOString());
	expect(response.body.surveyDescription).toBe('Test Survey');
	expect(response.body.surveyName).toBe('The Test');
});
