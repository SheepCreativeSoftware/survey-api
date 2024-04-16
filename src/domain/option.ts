import type { UUID } from 'node:crypto';
import crypto from 'node:crypto';

interface OptionOptions {
	optionName: string;
	content: string;
}

interface OptionCreationOptions extends OptionOptions {
	optionId: UUID | null;
}

class Option {
	private optionId: UUID | null = null;
	private optionName = '';
	private content = '';

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

	public create({ content, optionName }: OptionOptions) {
		if (this.optionId != null) {
			throw new Error('option is already created');
		}

		this.optionId = crypto.randomUUID();
		this.optionName = optionName;
		this.content = content;
	}

	public change({ content, optionName }: OptionOptions) {
		if (this.optionId == null) {
			throw new Error('option is not created yet');
		}

		this.optionName = optionName;
		this.content = content;
	}
}

const newOption = () => {
	return new Option();
};

const restoreOption = (options: OptionCreationOptions) => {
	return new Option(options);
};

export { Option, newOption, restoreOption };
