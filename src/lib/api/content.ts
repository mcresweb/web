import type { Catalogue } from '$defs/content';
import type { FetchFunction } from '$defs/FetchFunction.type';

/**
 * 列出大分类
 * @param f fetch
 * @returns 大分类
 */
export const listCatalogue = async (f: FetchFunction): Promise<Catalogue[]> => {
	const resp = await f('/api/content/list-catalogue');
	if (!resp.ok) throw new Error();
	return await resp.json();
};
