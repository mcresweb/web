import type { ApiResp } from '$defs/ApiResp';
import type { EssayList } from '$defs/content';
import { v4 } from '@lukeed/uuid';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (): ApiResp<EssayList> => {
	const getData = (id: number): EssayList['list'][number] => {
		return {
			id,
			sender: 'yuanlu' + id,
			title: '随机' + Math.random().toString().substring(2),
			star: Math.random() > 0.5 ? ((Math.random() * 50) | 0) / 10 : undefined,
			download: (Math.random() * 100000) | 0,
			img: v4().replace(/-/g, ''),
		};
	};
	return {
		body: {
			page: 10,
			list: [
				{
					id: 1,
					sender: 'yuanlu',
					title: '一款游戏地图',
					star: 3.5,
					download: 50,
					img: '681e020597ffc4710c33838df3d6b1f5',
				},
				{
					id: 2,
					sender: 'somebody',
					title: '另一款游戏地图',
					star: 5,
					download: 100,
					img: 'b9d692a8348d639843f5c67c0ec03587',
				},
				...Array(20)
					.fill(1)
					.map((_, i) => getData(i + 3)),
			],
		},
	};
};
