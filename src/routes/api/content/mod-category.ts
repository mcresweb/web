import type { ApiResp } from '$defs/ApiResp';
import type { ModResp } from '$defs/content';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (): ApiResp<ModResp> => {
	return {
		body: {
			success: true,
		},
	};
};
