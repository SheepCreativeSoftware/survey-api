import { buntstift } from 'buntstift';
import mariadb from 'mariadb';

let conn: null | mariadb.Connection = null;
let config: mariadb.ConnectionConfig = {};
let timeoutHandler: null | NodeJS.Timeout = null;

// Timer set to 10min
const timeout = Number(process.env.DATABASE_CON_TIMEOUT) || 600;

/** If not executed in a given time then the connection get's closed */
const resetCloseConnection = () => {
	if (timeoutHandler) {
		timeoutHandler.refresh();
		buntstift.verbose('Refresh DB connection timeout');
	} else {
		timeoutHandler = setTimeout(async () => {
			buntstift.verbose('Close DB connection due to no use');
			await conn?.end();
			timeoutHandler = null;
		}, timeout * 1000);
	}
};

/** Establish events from DB connector */
const setupEvents = () => {
	if (conn === null) {
		return;
	}
	conn.on('end', () => buntstift.verbose('Connection to DB closed'));
	conn.on('error', error => {
		buntstift.error('Connection to DB failed');
		if (error.fatal) {
			buntstift.warn(error.message);
		} else {
			buntstift.warn(error.message);
		}
	});
};

/** Reconnects to the the DB or returns current connection */
const reconnectDb = async (firstConnect?: boolean) => {
	if (conn?.isValid()) {
		return conn;
	}
	if (!firstConnect) {
		buntstift.verbose('Reconnect DB');
	}
	conn = await mariadb.createConnection(config);
	setupEvents();
	resetCloseConnection();
	return conn;
};

/** Establish a connection to DB or returns current connection */
const connectDb = (connectionUri: mariadb.ConnectionConfig) => {
	if (conn?.isValid()) {
		return conn;
	}
	buntstift.verbose('Connect DB');
	config = connectionUri;
	return reconnectDb(true);
};

/** Returns the current active connection */
const getConnection = () => {
	if (conn?.isValid()) {
		resetCloseConnection();
		return conn;
	}
	return reconnectDb();
};

/* Close the connection to the DB */
const closeConnection = async () => {
	buntstift.verbose('Close DB connection');
	await conn?.end();
	if (timeoutHandler !== null) {
		clearTimeout(timeoutHandler);
	}
};

process.on('exit', () => {
	conn?.destroy();
	buntstift.verbose('Destroy DB connection');
});

export { connectDb, closeConnection, getConnection };
