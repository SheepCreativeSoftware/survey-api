import http from 'node:http';
import { buntstift } from 'buntstift';
import { closeConnection } from './database/connectDatabase';
import { getApi } from './api/getApi';
import { initDatabase } from './database/initDefaultDatabase';

/** No unnecessary output to console in production */
if (process.env.NODE_ENV === 'development') {
	buntstift.configure(buntstift.getConfiguration().withVerboseMode(true));
} else {
	buntstift.configure(buntstift.getConfiguration().withQuietMode(true));
}

const startup = async () => {
	// Setup defaults first and then start server
	await initDatabase();

	// Start Server
	const server = http.createServer(getApi());

	server
		.listen(process.env.PORT, () => {
			buntstift.success(`Server started and is listening on Port ${process.env.PORT}`);
		})
		.on('error', error => {
			buntstift.error(`Server failed because of ${error.message}`);
			throw error;
		});

	process.on('uncaughtException', async (err, origin) => {
		// Print last output
		buntstift.error(`Uncaught exception: ${err}\n`);
		buntstift.error(`Exception origin: ${origin}`);
		if (err.stack) {
			buntstift.error(`Stack: ${err.stack}`);
		}
		buntstift.error('Exiting Process...');

		server.close();
		await closeConnection();

		// Kill app, because you don't know what the concesquences will be (restart-on-failure from server-side)
		process.exit(1);
	});
};

startup();
