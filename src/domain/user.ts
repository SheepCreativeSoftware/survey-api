import type { UUID } from 'node:crypto';
import crypto from 'node:crypto';

interface UserOptions {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

interface UserCreationOptions extends UserOptions {
	userId: UUID | null;
	active: boolean;
}

class User {
	private userId: UUID | null = null;
	private firstName = '';
	private lastName = '';
	private email = '';
	private password = '';
	private active = false;

	public constructor(options?: UserCreationOptions) {
		if (typeof options === 'undefined') {
			return;
		}
		this.userId = options.userId;
		this.firstName = options.firstName;
		this.lastName = options.lastName;
		this.email = options.email;
		this.password = options.password;
		this.active = options.active;
	}

	public activate() {
		if (this.userId == null) {
			throw new Error('Conflict', { cause: 'user is not created yet' });
		}

		this.active = true;
	}

	public disable() {
		if (this.userId == null) {
			throw new Error('user is not created yet');
		}

		this.active = false;
	}

	public isActive() {
		return this.active;
	}

	public getUserId() {
		if (this.userId == null) {
			throw new Error('user is not created yet');
		}
		return this.userId;
	}

	public getFirstName() {
		return this.firstName;
	}

	public getLastName() {
		return this.lastName;
	}

	public getEmail() {
		return this.email;
	}

	public getPassword() {
		return this.password;
	}

	public create({ firstName, lastName, email, password }: UserOptions) {
		if (this.userId != null) {
			throw new Error('user is already created');
		}

		this.userId = crypto.randomUUID();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.active = false;
	}

	public change({ firstName, lastName, email, password }: Partial<UserOptions>) {
		if (this.userId == null) {
			throw new Error('user is not created yet');
		}

		this.firstName = firstName || this.firstName;
		this.lastName = lastName || this.lastName;
		this.email = email || this.email;
		this.password = password || this.password;
	}
}

const newUser = () => {
	return new User();
};

const restoreUser = (options: UserCreationOptions) => {
	return new User(options);
};

export { newUser, restoreUser };
