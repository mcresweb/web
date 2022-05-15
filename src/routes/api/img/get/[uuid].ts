import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	return {
		status: 302,
		headers: {
			Location: `/img${(Math.random() * 2 + 1) | 0}.jpg`,
		},
	};
};
