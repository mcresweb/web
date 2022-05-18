import type { ApiResp } from '$defs/ApiResp';
import type { FileInfo, FileList } from '$defs/content';
import { v4 } from '@lukeed/uuid';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (
	event,
): ApiResp<FileList | { success: false; err: string }> => {
	const essayStr = event.url.searchParams.get('essay');
	const essay = essayStr ? parseInt(essayStr) : null;
	if (!essay) return { body: { success: false, err: '无效ID' } };

	const amount = ((Math.random() * 15) | 0) + 1;
	return { body: { success: true, amount: amount, files: Array(amount).fill(0).map(summonFile) } };
};
/** 随机文件拓展名 */
const suffix = 'doc txt zip png jpg json mp3 pdf 7z'.split(' ');
/** 伪sha1 */
const sha1 = () =>
	(v4().replace(/-/g, '') + Math.random().toString(16).substring(2)).substring(0, 40);
/**@returns 生成的文件信息*/
function summonFile(): FileInfo {
	return {
		id: v4().replace(/-/g, ''),
		name: `文件 ${(Math.random() * 100) | 0}.${suffix[(Math.random() * suffix.length) | 0]}`,
		size: (Math.random() * 1000000) | 0,
		sha1: sha1(),
	};
}
