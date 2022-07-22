import { checkResp, type FetchFunction } from '$defs/FetchFunction.type';
import type { Platform } from '$defs/keyword';

/**
 * 获取platform
 * @param f fetch
 */
export const getPlatform = async (f: FetchFunction): Promise<Platform[]> => {
	const resp = await f('/config/keyword-platforms');
	await checkResp(resp);
	return await resp.json();
};
