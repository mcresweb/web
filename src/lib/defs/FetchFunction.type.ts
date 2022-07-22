import type { Load } from '@sveltejs/kit';

export type FetchFunction = Parameters<Load>[0]['fetch'];

/** 后端地址 */
export let API_URL: string = '';

export const setApiUrl = (url: string) => (API_URL = url);

/**
 * 检响应
 * @param resp Response
 * @throws 当`resp.ok`为false时, 抛出异常
 */
export const checkResp = async (resp: Awaited<ReturnType<FetchFunction>>, msg?: string) => {
	if (resp.ok) return;
	if (!msg) msg = resp.url;
	const data = resp.statusText || (await resp.text()) || 'Unknown';
	throw new Error(`[fetch] ${msg}: ${resp.status} - ${data}`);
};
