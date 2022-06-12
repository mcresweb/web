import { dev } from '$app/env';
import type {
	Catalogue,
	ModCatalogueRequest,
	Category,
	ModCategoryRequest,
	EssayUpload,
} from '$defs/content';
import { modCatalogue, modCategory, uploadEssay } from '$lib/api/content';
import { getSalt, doRegister } from '$lib/api/user';

export const devInit = async () => {
	if (!dev) return;
	async function register() {
		const username = 'yuanlu';
		const email = 'yuanlu@example.org';
		const code = '123456';
		const password = '9kg9qmWGXHAB47J';
		/**获取字符串摘要*/
		const hashString = (a: string, b: string) => {
			return `${(window as any).CryptoJS.SHA256(a + b)}`;
		};
		const salt = await getSalt(fetch);
		const pwd = hashString(password, salt.salt);
		const resp = await doRegister(fetch, { username, password: pwd, email, code });
		if (!resp.success) alert(resp.err);
	}
	async function addCata() {
		const cata: Catalogue = { key: 'map', index: 1, title: '地图' };
		if (!cata.key) return alert('Error');
		const data: ModCatalogueRequest = {
			index: cata.index + '',
			img: cata.img,
			name: cata.title || '',
			key: cata.key,
		};
		const resp = await modCatalogue(fetch, data);
		if (!resp.success) alert(resp.err);
	}
	async function addCate() {
		const catalogue = 'map';
		const cate: Category = { index: 1, key: 'game-map', title: '游戏地图' };
		if (!cate.key || !catalogue) return alert('Error');
		const data: ModCategoryRequest = {
			name: cate.title || '',
			img: cate.img,
			key: cate.key,
			index: cate.index + '',
			catalogue,
		};
		const resp = await modCategory(fetch, data);
		if (!resp.success) alert(resp.err);
	}
	async function addEssay() {
		const data: EssayUpload = {
			type: 'markdown',
			catalogue: 'map',
			category: 'game-map',
			title: '内容标题',
			description: '一个简短的描述',
			content:
				'# 标题\n\n<img src="https://www.baidu.com/img/flexible/logo/pc/result.png">123\n\n- a\n- b \n\n123',
			tags: ['123'],
			imgs: {},
		};
		await uploadEssay(fetch, data);
	}
	await register();
	await addCata();
	await addCate();
	await addEssay();
};
