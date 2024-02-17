import { getConnection } from '../connectDatabase';

const removeSessionsFromDb = async (creationToken: string) => {
	const conn = await getConnection();
	await conn.query(`DELETE FROM sessions 
	WHERE survey_id = (SELECT survey_id FROM survey
	WHERE creation_token = ?)`, [creationToken]);
};

export { removeSessionsFromDb };
