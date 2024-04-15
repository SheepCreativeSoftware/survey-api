import type { UUID } from 'node:crypto';

declare global {
	// biome-ignore lint/style/noNamespace: Necessary because express is using it
	namespace Express {
		interface User {
			userId: UUID;
			email: string;
			firstName: string;
			lastName: string;
		}

		interface Request {
			user?: User | undefined;
		}
	}
}
