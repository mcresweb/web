import type {
	Catalogue,
	Category,
	Essay,
	EssayList,
	EssayUpload,
	FileList,
	ModCatalogueRequest,
	ModCategoryRequest,
	ModResp,
	UploadResp,
} from '$defs/content';
import { API_URL, type FetchFunction } from '$defs/FetchFunction.type';
import { cacheOrGet } from '$helpers/browserCache';

/**
 * 列出大分类
 * @param f fetch
 * @returns 大分类
 * @throws Error 接口访问不成功
 */
export const listCatalogue = async (f: FetchFunction): Promise<Catalogue[]> => {
	const data = await cacheOrGet('listCatalogue', null, async () => {
		const resp = await f(`${API_URL}/api/content/list-catalogue`);
		if (!resp.ok) throw new Error();
		return await resp.json();
	});
	return data.sort(sortIndex);
};

/**
 * 通过key寻找大分类
 * @param f fetch
 * @param catalogue 大分类的key
 * @returns 大分类 / 找不到大分类
 * @throws Error 接口访问不成功
 */
export const getCatalogueByKey = async (
	f: FetchFunction,
	catalogue: string,
): Promise<Catalogue | undefined> => {
	const catas = await listCatalogue(f);
	return catas.find((x) => x.key == catalogue);
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
		const resp = await f(`${API_URL}/api/content/list-category?catalogue=${catalogue}`);
		if (!resp.ok) return null;
		return await resp.json();
	});
	return data && data.sort(sortIndex);
};

/**
 * 通过key寻找小分类
 * @param f fetch
 * @param catalogue 小分类的key
 * @param category 小分类的key
 * @returns 小分类 / 找不到小分类
 */
export const getCategoryByKey = async (
	f: FetchFunction,
	catalogue: string,
	category: string,
): Promise<Category | undefined> => {
	const cates = await listCategory(f, catalogue);
	return (cates && cates.find((x) => x.key == category)) || undefined;
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
		`${API_URL}/api/content/list-essay?catalogue=${catalogue}&category=${category}&page=${
			page - 1
		}`,
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
	const resp = await f(`${API_URL}/api/content/essay?id=${id}`);
	if (!resp.ok) return null;
	return await resp.json();
};
/**
 * 随机获取一个内容, 由后端决定
 * @param f fetch
 * @returns 内容 / 找不到内容
 */
export const getRandomEssay = async (f: FetchFunction): Promise<Essay | null> => {
	const resp = await f(`${API_URL}/api/content/random-essay`);
	if (!resp.ok) return null;
	return await resp.json();
};
/**
 * 修改大分类
 * @param f fetch
 * @param data 修改数据
 * @returns 修改响应
 */
export const modCatalogue = async (
	f: FetchFunction,
	data: ModCatalogueRequest,
): Promise<ModResp> => {
	const resp = await f(`${API_URL}/api/content/mod-catalogue`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	return await resp.json();
};

/**
 * 修改小分类
 * @param f fetch
 * @param data 修改数据
 * @returns 修改响应
 */
export const modCategory = async (f: FetchFunction, data: ModCategoryRequest): Promise<ModResp> => {
	const resp = await f(`${API_URL}/api/content/mod-category`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	return await resp.json();
};
/**
 * 上传内容
 * @param f fetch
 * @param data 内容数据
 * @returns 上传结果
 */
export const uploadEssay = async (
	f: FetchFunction,
	data: EssayUpload,
): Promise<UploadResp<number>> => {
	const resp = await f(`${API_URL}/api/content/upload-essay`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!resp.ok) return { success: false, err: `${resp.status} ${resp.statusText}` };
	return await resp.json();
};

/**
 * 列出内容的文件列表
 * @param f fetch
 * @param essay 内容ID
 * @returns 文件列表 / 错误消息
 */
export const listFile = async (f: FetchFunction, essay: number): Promise<FileList | string> => {
	if (isNaN(essay)) return '无效essay ID';
	const resp = await f(`${API_URL}/api/content/list-file?essay=${essay}`);
	if (!resp.ok) return `${resp.status} - ${await resp.text()}`;
	const info: FileList | { success: false; err: string } = await resp.json();
	if (!info.success) return info.err;
	return info;
};

/**
 * 上传文件
 * @param f fetch
 * @param essay 内容ID
 * @param files 文件
 * @returns 上传结果
 */
export const uploadFile = async (
	f: FetchFunction,
	essay: number,
	...files: File[]
): Promise<UploadResp<string[]>> => {
	if (isNaN(essay)) return { success: false, err: '无效 essay ID' };
	const data = new FormData();
	files.forEach((file) => data.append('file', file, file.name));
	const resp = await f(`${API_URL}/api/content/upload-file?essay=${essay}`, {
		method: 'POST',
		body: data,
	});
	if (!resp.ok) return { success: false, err: `${resp.status} - ${await resp.text()}` };
	return await resp.json();
};

/**
 * 获取内容分类url
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
/**
 * 获取内容url
 * @param essay 内容ID
 * @returns url
 */
export const essayUrl = (essay: number | string) => `/essay/${essay}`;

/**
 * 获取文件url
 * @param essay 内容ID
 * @param file 文件UUID
 * @returns url
 */
export const fileUrl = (essay: number, file: string) =>
	`/api/content/file?essay=${essay}&file=${file}`;

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
