import type { Icons } from './iconfont';

/** 一个菜单项 */
export type Menu = {
	/** 菜单名称 */
	name: string;
	/** 菜单图标 */
	icon?: Icons;
	/** 指向的链接 */
	link: string;
	/** 构建url */
	make?: (url: URL) => unknown;
	/** 精确匹配pathname */
	exact?: boolean;

	/** 额外匹配地址 */
	matchExtra?: string[] | string | MenuMatch;
};
/**菜单列表*/
export type Menus = Menu[];
/**菜单匹配模式*/
export type MenuMatch = (u: URL, menu: Menu) => boolean;

/**
 * 预置的菜单匹配项
 *
 * 参数不存在(url.search.t == null).
 *  */
export const DefaultType = (t: string): MenuMatch => {
	return (u, m) => {
		if (m.exact) {
			if (u.pathname != m.link.split('?')[0]) return false;
		} else if (!u.pathname.startsWith(m.link.split('?')[0])) return false;
		return u.searchParams.get(t) == null;
	};
};

export const MakeSearch = (t: string, v: string): ((url: URL) => URL) => {
	return (u) => {
		u.searchParams.set(t, v);
		return u;
	};
};

/**
 * 判断是否是当前菜单下的路径
 * @param now 当前url
 * @param menu 菜单项
 */
export const isNowMenu = (now: URL, menu: Menu): boolean => {
	if (isSubUrl(now, menu.link, menu.exact)) return true;
	const ext = menu.matchExtra;
	if (typeof ext === 'string') {
		if (isSubUrl(now, ext, menu.exact)) return true;
	} else if (ext instanceof Array) {
		for (const i in ext) if (isSubUrl(now, ext[i], menu.exact)) return true;
	} else if (ext instanceof Function) {
		return ext(now, menu);
	}

	return false;
};
/**
 * 获取当前菜单项
 * @param now 当前url
 * @param menus 所有菜单项
 * @returns 当前菜单项下标 / -1
 */
export const getNowMenu = (now: URL, menus: Menus): number => {
	return menus.findIndex((m) => isNowMenu(now, m));
};

/**
 * 判断是否是子路径
 * @param now 当前url
 * @param parent 匹配的url
 */
const isSubUrl = (now: URL, parent: string, exact?: boolean) => {
	const [path, ...searchs] = parent.split('?');

	if (exact) {
		if (now.pathname !== path) return false;
	} else if (!now.pathname.startsWith(path)) return false;

	if (searchs.length <= 0) return true;

	const badIndex = searchs
		.join('?')
		.split('&')
		.findIndex((search) => {
			const [k, ...v] = search.split('=');
			const str = now.searchParams.get(k);
			if (str === null) return true;
			if (str != v.join('=')) return true;
		});
	return badIndex < 0;
};
