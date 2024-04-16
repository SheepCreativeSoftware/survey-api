import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (password: string) => {
	const hash = await bcrypt.hash(password, saltRounds);
	return hash;
};

const comparePassword = async (password: string, hash: string) => {
	const isSamePassword = await bcrypt.compare(password, hash);
	return isSamePassword;
};

export { comparePassword, hashPassword };
