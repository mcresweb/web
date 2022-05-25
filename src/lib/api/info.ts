import { API_URL, type FetchFunction } from '$defs/FetchFunction.type';
import type { BasicInfo, RegisterInfo } from '$defs/info';

/**
 * 列出大分类
 * @param f fetch
 * @returns 大分类
 */
export const basic = async (f: FetchFunction): Promise<BasicInfo> => {
	const resp = await f(API_URL + '/api/info/basic');
	if (!resp.ok) throw new Error();
	return await resp.json();
};

/**
 * 列出大分类
 * @param f fetch
 * @returns 大分类
 */
export const register = async (f: FetchFunction): Promise<RegisterInfo> => {
	const resp = await f(API_URL + '/api/info/register');
	if (!resp.ok) throw new Error();
	return await resp.json();
};
