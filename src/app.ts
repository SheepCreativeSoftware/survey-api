
import { buntstift } from 'buntstift';
import { getApi } from './api/getApi';
import http from 'node:http';
import { initDatabase } from './database/initDefaultDatabase';


if(process.env.NODE_ENV === 'development') buntstift.configure(buntstift.getConfiguration().withVerboseMode(true));
else buntstift.configure(buntstift.getConfiguration().withQuietMode(true));

const startup = async () => {
	// Setup defaults first and then start server
	await initDatabase();

	// Start Server
	const server = http.createServer(getApi());

	server.listen(process.env.PORT, () => {
		buntstift.success(`Server started and is listening on Port ${process.env.PORT}`);
	}).on('error', (error) => {
		buntstift.error(`Server failed because of ${error.message}`);
	});
};

// eslint-disable-next-line no-shadow
process.on('uncaughtException', (err, origin) => {
	// Print last output
	buntstift.error(`Caught exception: ${err}\n`);
	buntstift.error(`Exception origin: ${origin}`);
	if(err.stack) buntstift.error(`Stack: ${err.stack}`);
	buntstift.error('Exiting Process...');

	// Kill app, because you don't know what the concesquences will be (restart-on-failure from server-side)
	process.exit(1);
});

startup();
