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

test('Returns the share link from with the public token', async () => {
	const response = await request(app)
		.get('/api/v1/survey/share-link')
		.query({ creationToken })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(typeof response.body.shareLink).toBe('string');
}, 10_000);


test('Returns an error with missing token', async () => {
	const response = await request(app)
		.get('/api/v1/survey/share-link')
		.query({ })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
});

