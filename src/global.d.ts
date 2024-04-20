import type { UUID } from 'node:crypto';

declare global {
	// biome-ignore lint/style/noNamespace: Necessary because express is using it
	namespace Express {
		interface CreatorUser {
			role: 'Creator';
			userId: UUID;
		}

		interface AnswererUser {
			role: 'Answerer';
			surveyId: UUID;
			endDate: string;
		}

		type User = CreatorUser | AnswererUser;

		interface Request {
			user?: User | undefined;
			isLoggedIn: undefined | (() => boolean);
		}
	}
}
