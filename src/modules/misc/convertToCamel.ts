/** Converts snake_case into camelCase */
const snakeToCamelCase = (text: string) => {
	return text.replace(/([_][a-z])/gi, subString => {
		return subString.toUpperCase().replace('_', '');
	});
};

type RandomObject = {
	[key: string]: RandomObject | RandomObject[];
};

const keysToCamelCase = (object: RandomObject | RandomObject[]): unknown => {
	if (Array.isArray(object)) {
		return object.map((value: RandomObject | RandomObject[]) => {
			return keysToCamelCase(value);
		});
	}

	// Prevent function and interfaces to be converted
	if (Object.prototype.toString.call(object) === '[object Object]') {
		// biome-ignore lint/suspicious/noExplicitAny: This object can be anything
		const newObject: any = {};

		for (const key in object) {
			// ...
			newObject[snakeToCamelCase(key)] = keysToCamelCase(object[key]);
		}

		return newObject;
	}
	return object;
};

export { keysToCamelCase };
