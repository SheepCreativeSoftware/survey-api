import type { TypeCastFunction } from 'mariadb';

const tinyToBoolean: TypeCastFunction = (column, next) => {
	if (column.type === 'TINY' && column.columnLength === 1) {
		const val = column.int();
		return val === null ? null : val === 1;
	}
	return next();
};

export { tinyToBoolean };
