import { browser, dev } from '$app/env';
import type { Catalogue, Category } from '$defs/content';
import type { MaybePromise } from '@sveltejs/kit/types/private';

/** 缓存前缀 */
export const prefix = 'MCRESWEB_';

/** 所有缓存类型 */
export type types = {
	listCatalogue: Catalogue[];
	listCategory: Category[] | null;
	tokenLen: number;
};
/** 缓存类型键 */
export type names = keyof types;

/**
 * 使用缓存或直接获取
 * @param type 键
 * @param getter 直接获取
 * @returns 数据
 */
export const cacheOrGet = async <T extends names>(
	type: T,
	sub: string | undefined | null = undefined,
	getter: () => MaybePromise<types[T]>,
): Promise<types[T]> => {
	let data = getCache(type, sub);
	if (data !== null) return data;
	data = await getter();
	return setCache(type, sub, data);
};

/**
 * 获取缓存
 * @param type 键
 * @returns 数据
 */
export const getCache = <T extends names>(
	type: T,
	sub: string | undefined | null = undefined,
): types[T] | null => {
	if (!browser || !sessionStorage || dev) return null;
	const data = sessionStorage.getItem(prefix + type + (sub || ''));
	return data === null ? null : JSON.parse(data);
};
/**
 * 设置缓存
 * @param type 键
 * @param data 数据
 * @returns 传入的数据
 */
export const setCache = <T extends names>(
	type: T,
	sub: string | undefined | null = undefined,
	data: types[T],
): types[T] => {
	if (!browser || !sessionStorage) return data;
	if (data) sessionStorage.setItem(prefix + type + (sub || ''), JSON.stringify(data));
	else sessionStorage.removeItem(prefix + type + (sub || ''));
	return data;
};
