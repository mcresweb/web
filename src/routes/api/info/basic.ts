import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	return {
		body: {
			catalogue: 3,
			essay: 102,
			user: 5,
			day: 120,
		},
	};
};
