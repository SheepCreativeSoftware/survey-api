import type { Connection } from 'mariadb';
import type { Option } from '../../../domain/option';
import type { OptionCreationOptions } from '../../../domain/option';
import type { RequestOptions } from './request';
import type { SelectSurvey } from './sqlOutputValidation';
import type { UUID } from 'node:crypto';
import { getConnection } from '../../../database/connectDatabase';
import { restoreOption, newOption } from '../../../domain/option';

const insertOptionDb = async (surveyId: UUID, conn: Connection, option: Option) => {
	await conn.query(
		`INSERT INTO options
		(survey_id, option_id, option_name, content)
		VALUES (?, ?, ?, ?)`,
		[surveyId, option.getOptionId(), option.getOptionName(), option.getContent()],
	);
};

const updateOptionDb = async (conn: Connection, option: Option) => {
	await conn.query(
		`UPDATE options
		SET option_name = ?, content = ?
		WHERE option_id = ?`,
		[option.getOptionName(), option.getContent(), option.getOptionId()],
	);
};

const deleteOptionDb = async (conn: Connection, option: Option) => {
	await conn.query(
		`DELETE FROM options
		WHERE option_id = ?`,
		[option.getOptionId()],
	);
};

const updateOptions = async (data: SelectSurvey, options: RequestOptions) => {
	const optionsList: Option[] = [];
	for (const row of data) {
		const { options } = row;
		const option = restoreOption(options as OptionCreationOptions);
		optionsList.push(option);
	}

	for (const requestOption of options) {
		if (requestOption.status === 'New') {
			const option = newOption();
			option.create({
				content: requestOption.content,
				optionName: requestOption.optionName,
			});
			optionsList.push(option);
		} else {
			const indexOf = optionsList.findIndex(
				option => option.getOptionId() === requestOption.optionId,
			);
			if (indexOf !== -1) {
				optionsList[indexOf].change({
					content: requestOption.content,
					optionName: requestOption.optionName,
					status: requestOption.status,
				});
			}
		}
	}

	const surveyId = data[0].survey.surveyId as UUID;

	const conn = await getConnection();
	for (const option of optionsList) {
		switch (option.getStatus()) {
			case 'New':
				await insertOptionDb(surveyId, conn, option);
				break;
			case 'Update':
				await updateOptionDb(conn, option);
				break;
			case 'Delete':
				await deleteOptionDb(conn, option);
				break;
		}
	}
};

export { updateOptions };
