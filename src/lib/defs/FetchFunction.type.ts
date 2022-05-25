import type { Load } from '@sveltejs/kit';

export type FetchFunction = Parameters<Load>[0]['fetch'];

/** 后端地址 */
export let API_URL: string = '';

export const setApiUrl = (url: string) => (API_URL = url);
