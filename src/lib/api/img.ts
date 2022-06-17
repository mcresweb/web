import { API_URL, type FetchFunction } from '$defs/FetchFunction.type';
import type { ImgUploadResp } from '$defs/img';

/**
 * 转换为图片url
 * @param img 图片UUID
 * @returns 图片url
 */
export const imgUrl = (img: string) => `${API_URL}/api/img/get/${img}`;

/**
 * 上传图片
 * @param data 图片数据
 */
export const uploadImg = async (
	fetch: FetchFunction,
	data: string | ArrayBuffer | null,
): Promise<ImgUploadResp> => {
	const resp = await fetch('/api/img/upload', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/octet-stream',
		},
		body: data,
	});
	if (!resp.ok) return { success: false, err: `${resp.status} - ${await resp.text()}` };
	return await resp.json();
};
