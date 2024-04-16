import type { UUID } from 'node:crypto';

declare global {
	// biome-ignore lint/style/noNamespace: Necessary because express is using it
	namespace Express {
		interface User {
			userId: UUID;
			role: 'Creator' | 'Answerer';
		}

		interface Request {
			user?: User | undefined;
			isLoggedIn: undefined | (() => boolean);
		}
	}
}
