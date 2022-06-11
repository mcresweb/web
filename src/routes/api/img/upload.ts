import type { ApiResp } from '$defs/ApiResp';
import type { ImgUploadResp } from '$defs/img';
import { v4 } from '@lukeed/uuid';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (): ApiResp<ImgUploadResp> => {
	return {
		body: Math.random() > -1 ? { success: true, uuid: v4() } : { success: false, err: '错误' },
	};
};
