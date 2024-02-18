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
let CSRFToken = '';
let cookie = '';
let surveyId = NaN;



beforeAll(async () => {
	// Establish connection to db, as it is required
	await initDatabase();
	const session = await request(app).get('/api/v1/survey/startSession');
	CSRFToken = session.body.CSRFToken;
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
	surveyId = await getSurveyIdFromDb(creationToken);
});

afterAll(async () => {
	await removeSessionsFromDb(creationToken);
	await removeOptionsFromDb(creationToken);
	await removeSurveyFromDb(creationToken);
	server.close();
	await closeConnection();
});

test('Post a answer without a error', async () => {
	const response = await request(app)
		.post('/api/v1/answer-survey/finishSurvey')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			optionSelection: ['abc1234', 'abc1337', 'abc1235'],
			surveyId,
		});

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
});
