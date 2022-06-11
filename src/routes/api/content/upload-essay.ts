import type { ApiResp } from '$defs/ApiResp';
import type { UploadResp } from '$defs/content';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (): ApiResp<UploadResp<number> | null> => {
	return { body: { success: true, id: (Math.random() * 100) | 0 } };
};
