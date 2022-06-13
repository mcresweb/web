import { API_URL, type FetchFunction } from '$defs/FetchFunction.type';
import type { SearchReq, SearchResp, SummonReq, UseReq, UseResp } from '$defs/keyword';
import { cacheOrGet } from '$helpers/browserCache';

/**
 * 使用会员码
 * @param f fetch
 * @param token 会员码
 * @returns 使用情况
 */
export const useToken = async (f: FetchFunction, token: string): Promise<UseResp> => {
	const data: UseReq = { token };
	const resp = await f(`${API_URL}/api/keyword/use`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!resp.ok) return { success: false, err: `${resp.status} ${resp.statusText}` };
	return await resp.json();
};

/**
 * 获取会员码应有的长度
 * @param f fetch
 * @returns 会员码长度
 */
export const tokenLen = async (f: FetchFunction): Promise<number> => {
	return cacheOrGet('tokenLen', null, () => f('/api/keyword/token-len').then((r) => r.json()));
};

/**
 * 生成会员码
 * @param f fetch
 * @param data 生成信息
 */
export const summonToken = async (f: FetchFunction, data: SummonReq): Promise<string[]> => {
	const resp = await f(`${API_URL}/api/keyword/summon`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return await resp.json();
};

/**
 * 搜索会员码
 * @param f fetch
 * @param data 搜索限定
 * @returns 搜索结果
 */
export const searchToken = async (f: FetchFunction, data: SearchReq): Promise<SearchResp> => {
	const resp = await f(`${API_URL}/api/keyword/list`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	return await resp.json();
};
