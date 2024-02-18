
import { buntstift } from 'buntstift';
import { initDatabase } from './modules/database/initDefaultDatabase';
import { startServer } from './server';


if(process.env.NODE_ENV === 'development') buntstift.configure(buntstift.getConfiguration().withVerboseMode(true));
else buntstift.configure(buntstift.getConfiguration().withQuietMode(true));

const startup = async () => {
	// Setup defaults first and then start server
	await initDatabase();
	startServer();
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
