/* eslint-disable no-magic-numbers */
import { closeConnection } from '../src/modules/database/connectDatabase';
import { initDatabase } from '../src/modules/database/initDefaultDatabase';
import request from 'supertest';
import { startServer } from '../src/server';


const { app, server } = startServer();
let CSRFToken = '';
let cookie = '';

beforeAll(async () => {
	// Establish connection to db, as it is required
	await initDatabase();
	const session = await request(app).get('/api/v1/survey/startSession');
	CSRFToken = session.body.CSRFToken;
	cookie = session.headers['set-cookie'];
});

afterAll(async () => {
	server.close();
	await closeConnection();
});

test('Adding option fails because of missing creationToken', async () => {
	const response = await request(app)
		.post('/api/v1/manage-survey/addOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			content: 'Ist diese Option gut?',
			optionName: 'Fangfrage',
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
}, 10_000);

test('Get option fails because of missing query params', async () => {
	const response = await request(app)
		.get('/api/v1/manage-survey/getOption')
		.set('Accept', 'application/json');

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
}, 10_000);

test('Update options fails because of missing params', async () => {
	const response = await request(app)
		.post('/api/v1/manage-survey/updateOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
			content: 'Ist diese Option nicht gut?',
			optionName: 'Keine Fangfrage',
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
}, 10_000);

test('Remove options fails because of missing params ', async () => {
	const response = await request(app)
		.post('/api/v1/manage-survey/deleteOption')
		.set('Accept', 'application/json')
		.set('x-csrf-token', CSRFToken)
		.set('cookie', cookie)
		.send({
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
}, 10_000);

test('Remove options fails because of missing params ', async () => {
	const response = await request(app)
		.get('/api/v1/manage-survey/getAllOptions')
		.set('Accept', 'application/json')
		.send({
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
}, 10_000);

test('Remove options fails because of missing params ', async () => {
	const response = await request(app)
		.get('/api/v1/manage-survey/getShareLink')
		.set('Accept', 'application/json')
		.send({
		});

	expect(response.statusCode).toBe(400);
	expect(response.header['content-type']).toMatch(/json/);
	expect(response.body.status).toEqual('Bad Request');
	expect(response.body.statusCode).toEqual(400);
}, 10_000);
