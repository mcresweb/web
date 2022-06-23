import type { ContentType } from '$defs/content';
import { bbcode } from '$helpers/bbcode';
import type { RequestHandler } from '@sveltejs/kit';
import { marked } from 'marked';
export const post: RequestHandler = async (event) => {
	/**请求的文本类型 */
	const type: ContentType = event.params.type as any;
	/**请求的文本 */
	let txt = await event.request.text();
	/**是否是html */
	let html = true;
	switch (type) {
		case 'markdown':
			txt = marked(txt);
			break;
		case 'bbcode':
			txt = bbcode(txt);
			break;
		case 'html':
			break;
		case 'text':
		default:
			html = false;
			break;
	}
	return { body: { html, txt } };
};
