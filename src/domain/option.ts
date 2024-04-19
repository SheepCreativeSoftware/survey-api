import type { UUID } from 'node:crypto';
import crypto from 'node:crypto';

type Status = 'Unchanged' | 'New' | 'Update' | 'Delete';

interface OptionOptions {
	optionName: string;
	content: string;
}

interface OptionCreationOptions extends OptionOptions {
	optionId: UUID | null;
}

interface ChangeOptionOptions extends Partial<OptionOptions> {
	status?: Status;
}

class Option {
	private optionId: UUID | null = null;
	private optionName = '';
	private content = '';
	private status: Status = 'Unchanged';

	public constructor(options?: OptionCreationOptions) {
		if (typeof options === 'undefined') {
			return;
		}
		this.optionId = options.optionId;
		this.optionName = options.optionName;
		this.content = options.content;
	}

	public getOptionId(): UUID {
		if (this.optionId === null) {
			throw new Error('option is not created yet');
		}
		return this.optionId;
	}

	public getOptionName() {
		return this.optionName;
	}

	public getContent() {
		return this.content;
	}

	public getStatus() {
		return this.status;
	}

	public create({ content, optionName }: OptionOptions) {
		if (this.optionId != null) {
			throw new Error('option is already created');
		}

		this.optionId = crypto.randomUUID();
		this.optionName = optionName;
		this.content = content;
		this.status = 'New';
	}

	public change({ content, optionName, status }: ChangeOptionOptions) {
		if (this.optionId == null) {
			throw new Error('option is not created yet');
		}

		this.optionName = optionName || this.optionName;
		this.content = content || this.content;
		this.status = status || this.status;
	}
}

const newOption = () => {
	return new Option();
};

const restoreOption = (options: OptionCreationOptions) => {
	return new Option(options);
};

export type { OptionCreationOptions };
export { Option, newOption, restoreOption };
