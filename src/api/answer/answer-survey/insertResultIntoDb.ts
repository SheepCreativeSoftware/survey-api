import { buntstift } from 'buntstift';
import { SqlError, type Connection } from 'mariadb';
import { ConflictException } from '../../../modules/misc/customErrors';

type ResultValues = {
	answererId: string;
	optionId: string;
};

const insertResultIntoDb = async (conn: Connection, results: ResultValues[]) => {
	const sqlValueParameter = '(?, ?)';
	let sqlMultipleValueParameters = '';

	const values: string[] = [];

	for (let index = 0; index < results.length; index++) {
		values.push(results[index].optionId, results[index].answererId);

		// No comma for the last parameter
		if (index < results.length - 1) {
			sqlMultipleValueParameters += `${sqlValueParameter}, `;
		} else {
			sqlMultipleValueParameters += `${sqlValueParameter}`;
		}
	}

	try {
		await conn.query(
			`INSERT INTO results
			(option_id, answerer_id)
			VALUES ${sqlMultipleValueParameters}`,
			[...values],
		);
	} catch (error) {
		if (error instanceof SqlError) {
			buntstift.error(error.message);
			throw new ConflictException('Already answered or invalid option');
		}
	}
};

export type { ResultValues };
export { insertResultIntoDb };
