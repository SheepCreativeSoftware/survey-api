
/** Converts snake_case into camelCase */
const snakeToCamelCase = (text: string) => {
	return text.replace(/([_][a-z])/ig, (subString) => {
		return subString.toUpperCase()
			.replace('_', '');
	});
};

type RandomObject = {
	[key: string]: RandomObject | RandomObject[],
}

const keysToCamelCase = (object: RandomObject | RandomObject[]): unknown => {
	if(Array.isArray(object)) {
		return object.map((value: RandomObject | RandomObject[]) => {
			return keysToCamelCase(value);
		});
	}
	if(typeof object === 'object') {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const newObject: any = {};

		for(const key in object) {
			// ...
			newObject[snakeToCamelCase(key)] = keysToCamelCase(object[key]);
		}

		return newObject;
	}
	return object;
};

export { keysToCamelCase };
