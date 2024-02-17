/* eslint-disable no-magic-numbers */
import { closeConnection, connectDb } from '../src/modules/database/connectDatabase';
import request from 'supertest';
import { startServer } from '../src/server';


const { app, server } = startServer();
let creationToken = '';
let CSRFToken = '';
let cookie = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await connectDb({
		database: process.env.DATABASE_NAME,
		host: process.env.DATABASE_HOST,
		password: process.env.DATABASE_PASSWORD,
		port: Number(process.env.DATABASE_PORT),
		user: process.env.DATABASE_USER,
	});
	const session = await request(app).get('/api/v1/survey/startSession');
	CSRFToken = session.body.CSRFToken;
	cookie = session.headers['set-cookie'];

	const response = await request(app)
		.post('/api/v1/survey/createNew')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			creatorName: 'My Name',
			endDate: '2025-01-01T00:00:00Z',
			surveyDescription: 'Test Survey',
			surveyName: 'The Test',
		});

	expect(response.statusCode).toBe(201);
	expect(response.body.creationToken).toBeDefined();
	creationToken = response.body.creationToken;
});

afterAll(async () => {
	await request(app)
		.post('/api/v1/survey/removeSurvey')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({ creationToken });
	server.close();
	await closeConnection();
});

let optionId = '';
test('Adds a new option and returns the option id', async () => {
	const response = await request(app)
		.post('/api/v1/manage-survey/addOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			content: 'Ist diese Option gut?',
			creationToken,
			optionName: 'Fangfrage',
		});

	expect(response.statusCode).toBe(201);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Created');
	expect(response.body.statusCode).toEqual(201);
	expect(typeof response.body.optionId).toBe('string');
	optionId = response.body.optionId;
});

test('Returns the previously added option', async () => {
	const response = await request(app)
		.get('/api/v1/manage-survey/getOption')
		.query({ creationToken, optionId })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(response.body.optionId).toBe(optionId);
	expect(response.body.optionName).toBe('Fangfrage');
	expect(response.body.content).toBe('Ist diese Option gut?');
});

test('Updates a option and returns OK', async () => {
	const response = await request(app)
		.post('/api/v1/manage-survey/updateOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			content: 'Ist diese Option nicht gut?',
			creationToken,
			optionId,
			optionName: 'Keine Fangfrage',
		});

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
});

test('Returns the previously updated option', async () => {
	const response = await request(app)
		.get('/api/v1/manage-survey/getOption')
		.query({ creationToken, optionId })
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
	expect(response.body.optionId).toBe(optionId);
	expect(response.body.optionName).toBe('Keine Fangfrage');
	expect(response.body.content).toBe('Ist diese Option nicht gut?');
});

test('Removes a option and returns OK', async () => {
	const response = await request(app)
		.post('/api/v1/manage-survey/deleteOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			creationToken,
			optionId,
		});

	expect(response.statusCode).toBe(200);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('OK');
	expect(response.body.statusCode).toEqual(200);
});
