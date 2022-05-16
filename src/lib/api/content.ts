import type { Catalogue, Category, Essay, EssayList } from '$defs/content';
import type { FetchFunction } from '$defs/FetchFunction.type';
import { cacheOrGet } from '$helpers/browserCache';

/**
 * 列出大分类
 * @param f fetch
 * @returns 大分类
 * @throws Error 接口访问不成功
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
 * @returns 小分类 / 找不到大分类
 */
export const listCategory = async (
	f: FetchFunction,
	catalogue: string,
): Promise<Category[] | null> => {
	const data = await cacheOrGet('listCategory', catalogue, async () => {
		const resp = await f(`/api/content/list-category?catalogue=${catalogue}`);
		if (!resp.ok) return null;
		return await resp.json();
	});
	return data && data.sort(sortIndex);
};

/**
 * 列出内容列表
 * @param f fetch
 * @param catalogue 大分类
 * @param category 小分类
 * @param page 页数(从1开始)
 * @returns 内容列表 / 找不到分类
 */
export const listEssay = async (
	f: FetchFunction,
	catalogue: string,
	category: string,
	page: number = 1,
): Promise<EssayList | null> => {
	const resp = await f(
		`/api/content/list-essay?catalogue=${catalogue}&category=${category}&page=${page}`,
	);
	if (!resp.ok) return null;
	const data: EssayList = await resp.json();
	data.list = data.list.sort(sortId);
	return data;
};
/**
 * 获取一个内容
 * @param f fetch
 * @param id 内容ID
 * @returns 内容 / 找不到内容
 */
export const getEssay = async (f: FetchFunction, id: number): Promise<Essay | null> => {
	if (isNaN(id)) return null;
	const resp = await f(`/api/content/essay?id=${id}`);
	if (!resp.ok) return null;
	return await resp.json();
};
/**
 * 获取内容url
 * @param catalogue 大分类
 * @param category 小分类
 * @param page 页码
 * @returns url
 */
export const contentUrl = (catalogue: string, category?: string, page?: number) => {
	let url = `/content/${catalogue}?p=${page || 1}`;
	if (category) url += '#' + category;
	return url;
};

/** index排序 */
const sortIndex = sortK('index');
/** id排序 */
const sortId = sortK('id', true);
/**
 * 创建排序器
 * @param k 排序键
 * @param desc 是否降序排序(默认升序)
 * @returns 排序器
 */
function sortK<K extends string, T extends { [x in K]: number }>(k: K, desc: boolean = false) {
	if (desc) return (a: T, b: T) => b[k] - a[k];
	else return (a: T, b: T) => a[k] - b[k];
}
