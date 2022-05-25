import { API_URL } from '$defs/FetchFunction.type';

/**
 * 转换为图片url
 * @param img 图片UUID
 * @returns 图片url
 */
export const imgUrl = (img: string) =>
	`${API_URL}/api/img/get/${img.replace(/-/g, '').toLowerCase()}`;
