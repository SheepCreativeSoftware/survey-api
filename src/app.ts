
import { buntstift } from 'buntstift';
import { initDatabase } from './modules/database/initDefaultDatabase.js';
import { startServer } from './server.js';


if(process.env.NODE_ENV === 'development') buntstift.configure(buntstift.getConfiguration().withVerboseMode(true));
else buntstift.configure(buntstift.getConfiguration().withQuietMode(true));

const startup = async () => {
	// Setup defaults first and then start server
	await initDatabase();
	startServer();
};

startup();
