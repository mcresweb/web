import type { ApiResp } from '$defs/ApiResp';
import type { MeInfo } from '$defs/user';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (): ApiResp<MeInfo> => {
	return {
		body: {
			login: true,
			id: 1,
			name: 'yuanlu',
			email: 'yuanlu@yuanlu.bid',
			admin: true,
			vip: true,
			lock: false,
		},
	};
};
