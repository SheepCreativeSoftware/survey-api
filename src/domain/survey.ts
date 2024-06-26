import type { UUID } from 'node:crypto';
import crypto from 'node:crypto';

type ChoicesType = 'single' | 'multiple';

interface SurveyOptions {
	surveyName: string;
	surveyDescription: string;
	choicesType: ChoicesType;
	endDate: Date;
}

interface SurveyCreationOptions extends SurveyOptions {
	surveyId: UUID | null;
	created: Date;
	completed: boolean;
}

class Survey {
	private surveyId: UUID | null = null;
	private surveyName = '';
	private surveyDescription = '';
	private choicesType: ChoicesType = 'single';
	private created: Date | null = null;
	private endDate: Date | null = null;
	private completed = false;

	public constructor(options?: SurveyCreationOptions) {
		if (typeof options === 'undefined') {
			return;
		}

		this.surveyId = options.surveyId;
		this.surveyName = options.surveyName;
		this.surveyDescription = options.surveyDescription;
		this.choicesType = options.choicesType;
		this.created = options.created;
		this.endDate = options.endDate;
		this.completed = options.completed;
	}

	public getSurveyId(): UUID {
		if (this.surveyId === null) {
			throw new Error('survey is not created yet');
		}
		return this.surveyId;
	}

	public getSurveyName(): string {
		return this.surveyName;
	}

	public getSurveyDescription(): string {
		return this.surveyDescription;
	}

	public getChoicesType(): ChoicesType {
		return this.choicesType;
	}

	public getCreated(): Date {
		if (this.created === null) {
			throw new Error('survey is not created yet');
		}
		return this.created;
	}

	public getEndDate(): Date {
		if (this.endDate === null) {
			throw new Error('survey is not created yet');
		}
		return this.endDate;
	}

	public isCompleted(): boolean {
		return this.completed;
	}

	public setComplete(): void {
		this.completed = true;
	}

	public create({ choicesType, endDate, surveyDescription, surveyName }: SurveyOptions) {
		if (this.surveyId != null) {
			throw new Error('survey is already created');
		}

		if (new Date().getTime() >= endDate.getTime()) {
			throw new Error('Bad Request', { cause: 'End date must be after current date' });
		}

		this.surveyId = crypto.randomUUID();
		this.surveyName = surveyName;
		this.surveyDescription = surveyDescription;
		this.choicesType = choicesType;
		this.created = new Date();
		this.endDate = endDate;
		this.completed = false;
	}

	public change({ choicesType, endDate, surveyDescription, surveyName }: SurveyOptions) {
		if (this.surveyId == null) {
			throw new Error('survey is not created yet');
		}

		if (new Date().getTime() >= endDate.getTime()) {
			throw new Error('Bad Request', { cause: 'End date must be after current date' });
		}

		this.surveyName = surveyName;
		this.surveyDescription = surveyDescription;
		this.choicesType = choicesType;
		this.endDate = endDate;
	}
}

const newSurvey = () => {
	return new Survey();
};

const restoreSurvey = (options: SurveyCreationOptions) => {
	return new Survey(options);
};

export type { SurveyOptions, SurveyCreationOptions };
export { Survey, newSurvey, restoreSurvey };
