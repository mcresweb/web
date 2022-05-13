import type { FetchFunction } from '$defs/FetchFunction.type';
import type { BasicInfo } from '$defs/info';

/**
 * 列出大分类
 * @param f fetch
 * @returns 大分类
 */
export const basic = async (f: FetchFunction): Promise<BasicInfo> => {
	const resp = await f('/api/info/basic');
	if (!resp.ok) throw new Error();
	return await resp.json();
};
