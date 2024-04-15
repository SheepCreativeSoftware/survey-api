import { UUID } from 'crypto';

declare global {
    namespace Express {
        interface User {
			userId: UUID,
			email: string,
			firstName: string,
			lastName: string,
		}

        interface Request {
            user?: User | undefined;
		}
	}
}