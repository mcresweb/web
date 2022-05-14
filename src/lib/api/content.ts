import type { Catalogue, Category } from '$defs/content';
import type { FetchFunction } from '$defs/FetchFunction.type';
import { cacheOrGet } from '$helpers/browserCache';

/**
 * 列出大分类
 * @param f fetch
 * @returns 大分类
 */
export const listCatalogue = async (f: FetchFunction): Promise<Catalogue[]> => {
	const data = await cacheOrGet('listCatalogue', null, async () => {
		const resp = await f('/api/content/list-catalogue');
		if (!resp.ok) throw new Error();
		return await resp.json();
	});
	return data.sort(sortIndex);
};
/**
 * 列出小分类
 * @param f fetch
 * @param catalogue 大分类
 * @returns 小分类
 */
export const listCategory = async (
	f: FetchFunction,
	catalogue: string,
): Promise<Category[] | null> => {
	const data = await cacheOrGet('listCategory', catalogue, async () => {
		const resp = await f('/api/content/list-category?catalogue=' + catalogue);
		if (!resp.ok) return null;
		return await resp.json();
	});
	return data && data.sort(sortIndex);
};
/** index排序 */
function sortIndex<T extends { index: number }>(a: T, b: T) {
	return a.index - b.index;
}
