import { API_URL, type FetchFunction } from '$defs/FetchFunction.type';
import type { SearchResult } from '$defs/search';

/**
 * 搜索内容
 *
 * 参数串:
 * ```
 * t=%1&catalogue=%2&category=%3&user=%4
 * ```
 * @param search 搜索参数串(url)
 */
export const searchEssay = async (
	f: FetchFunction,
	search: string,
): Promise<SearchResult | null> => {
	const resp = await f(`${API_URL}/api/search/essay${search}`);
	if (!resp.ok) {
		let msg = await resp.text();
		if (resp.status !== 403) msg = `${resp.status} - ${msg}`;
		return { hits: msg, hasMore: false, docs: null, cooling: 0 };
	}
	const cooling = parseInt(resp.headers.get('X-API-COOLING') || '0') || 0;
	const data: SearchResult | null = await resp.json();
	if (data != null) data.cooling = cooling;
	return data;
};
