import type { ResultValues } from './insertResultIntoDb';
import type { RequestBody } from './request';

const combineResults = (
	choicesType: 'single' | 'multiple',
	answererId: string,
	options: RequestBody,
) => {
	const results: ResultValues[] = [];

	if (choicesType === 'multiple' && Array.isArray(options)) {
		for (const option of options) {
			results.push({
				answererId,
				optionId: option.optionId,
			});
		}
	} else if (choicesType === 'single' && !Array.isArray(options)) {
		results.push({ answererId, optionId: options.optionId });
	} else {
		throw new Error('Conflict', { cause: 'Request does not match survey choice type' });
	}

	return results;
};

export { combineResults };
