import type { ApiResp } from '$defs/ApiResp';
import { config } from '$defs/config';
import type { Platform } from '$defs/keyword';
import type { RequestHandler } from '@sveltejs/kit';

const platforms: Platform[] = (() => {
	const pf: Record<string, Platform> = { ...config.keyword_platforms };
	delete pf['example'];
	return Object.values(pf);
})();

export const get: RequestHandler = async (): ApiResp<Platform[]> => {
	return { body: platforms };
};
