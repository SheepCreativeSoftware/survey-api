import { buntstift } from 'buntstift';
import mariadb from 'mariadb';

let conn = null as null | mariadb.Connection;
let config = {} as mariadb.ConnectionConfig;
let timeoutHandler = null as null | NodeJS.Timeout;

// Timer set to 10min
const timeout = 600_000;

/** If not executed in a given time then the connection get's closed */
const resetCloseConnection = () => {
	if(timeoutHandler) {
		timeoutHandler.refresh();
		buntstift.verbose('Refresh DB connection timeout');
	} else {
		timeoutHandler = setTimeout(() => {
			buntstift.verbose('Close DB connection due to no use');
			conn?.end();
			timeoutHandler = null;
		}, timeout);
	}
};

/** Establish events from DB connector */
const setupEvents = () => {
	if(conn === null) return;
	conn.on('end', () => buntstift.verbose('Connection to DB closed'));
	conn.on('error', (error) => {
		buntstift.error('Connection to DB failed');
		if(error.fatal) buntstift.warn(error.message);
		else buntstift.warn(error.message);
	});
};

/** Reconnects to the the DB or returns current connection */
const reconnectDb = async (firstConnect?: boolean) => {
	if(conn && conn.isValid()) return conn;
	if(!firstConnect) buntstift.verbose('Reconnect DB');
	conn = await mariadb.createConnection(config);
	setupEvents();
	resetCloseConnection();
	return conn;
};

/** Establish a connection to DB or returns current connection */
const connectDb = (connectionUri: mariadb.ConnectionConfig) => {
	if(conn && conn.isValid()) return conn;
	buntstift.verbose('Connect DB');
	config = connectionUri;
	return reconnectDb(true);
};

/** Returns the current active connection */
const getConnection = () => {
	if(conn && conn.isValid()) {
		resetCloseConnection();
		return conn;
	}
	return reconnectDb();
};


process.on('exit', () => {
	conn?.destroy();
	buntstift.verbose('Destroy DB connection');
});

export { connectDb, getConnection };
