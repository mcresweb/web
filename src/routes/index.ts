import type { RequestHandler } from '@sveltejs/kit';

/**跳转至首页 */
export const get: RequestHandler = async () => {
	return { status: 302, headers: { Location: '/home' } };
};
