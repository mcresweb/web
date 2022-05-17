import type { ApiResp } from '$defs/ApiResp';
import type { UserInfo } from '$defs/user';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (): ApiResp<UserInfo> => {
	return {
		body: {
			id: 'b9d692a8348d639843f5c67c0ec03587', //用户UUID
			name: 'yuanlu', //用户名
			admin: true, //是否是管理员
			vip: true, //是否是VIP
			lock: false, //是否被锁定
		},
	};
};
