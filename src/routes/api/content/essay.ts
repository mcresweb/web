import type { ApiResp } from '$defs/ApiResp';
import type { Essay } from '$defs/content';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (event): ApiResp<Essay | null> => {
	const idStr = event.url.searchParams.get('id');
	const id = idStr ? parseInt(idStr) : NaN;

	if (isNaN(id)) return { status: 404, body: null };

	return {
		body: {
			id,
			catalogue: 'maps',
			category: 'game',
			sender: 'b9d692a8348d639843f5c67c0ec03587',
			title: '一款游戏地图',
			star: 5,
			download: 100,
			imgs: ['681e020597ffc4710c33838df3d6b1f5', 'b9d692a8348d639843f5c67c0ec03587'],
			content: '# 一款游戏地图\n 这是一款游戏地图的介绍文章, 采用markdown语言编写',
			type: 'markdown',
		},
	};
};
