import type { ApiResp } from '$defs/ApiResp';
import type { Essay } from '$defs/content';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (event): ApiResp<Essay | null> => {
	const idStr = event.url.searchParams.get('id');
	const id = idStr ? parseInt(idStr) : NaN;

	if (isNaN(id)) return { status: 404, body: null };

	const hasStar = Math.random() > 0.5;

	return {
		body: {
			id,
			catalogue: 'maps',
			category: 'game',
			sender: 'b9d692a8348d639843f5c67c0ec03587',
			title: '一款游戏地图',
			star: hasStar ? Math.random() * 5 : undefined,
			starAmount: hasStar ? (Math.random() * 1000) | 0 : undefined,
			download: (Math.random() * 1000) | 0,
			imgs: ['681e020597ffc4710c33838df3d6b1f5', 'b9d692a8348d639843f5c67c0ec03587'],
			content:
				'# 一款游戏地图的标题\n 这是一款游戏地图的介绍文章, 采用markdown语言编写  \n- 列表1\n- 列表2',
			type: 'markdown',
			description: '这是一个简略的描述, 将会显示在摘要栏中, 如果此项为空, 则将不显示',
			tags: ['地图', '另一个标签', '好玩的地图', '游戏地图'],
		},
	};
};
