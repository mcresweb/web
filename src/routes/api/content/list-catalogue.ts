import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
	return {
		body: [
			{
				index: 1,
				title: '地图',
				key: 'maps',
				img: '681e020597ffc4710c33838df3d6b1f5',
			},
			{
				index: 2,
				title: '模组',
				key: 'mods',
				img: 'b9d692a8348d639843f5c67c0ec03587',
			},
			{
				index: 3,
				title: '插件',
				key: 'plugins',
				img: '2d9743b1b9af10029f33e5b58eef5bed',
			},
		],
	};
};
