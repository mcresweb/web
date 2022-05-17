import type { ApiResp } from '$defs/ApiResp';
import type { MeInfo } from '$defs/user';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (): ApiResp<MeInfo> => {
	return {
		body: {
			login: true,
			id: 'b9d692a8348d639843f5c67c0ec03587',
			name: 'yuanlu',
			email: 'yuanlu@yuanlu.bid',
			admin: true,
			vip: true,
			lock: false,
		},
	};
};
