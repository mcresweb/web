import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async (event) => {
	const cata = event.url.searchParams.get('catalogue');

	if (cata === 'maps')
		return {
			body: [
				{ index: 1, title: '游戏地图', key: 'game', img: '681e020597ffc4710c33838df3d6b1f5' },
				{ index: 2, title: '恐怖地图', key: 'terror', img: 'b9d692a8348d639843f5c67c0ec03587' },
				{ index: 3, title: 'RPG地图', key: 'rpg', img: '2d9743b1b9af10029f33e5b58eef5bed' },
			],
		};
	else if (cata === 'mods')
		return {
			body: [
				{ index: 1, title: '辅助模组', key: 'help', img: '681e020597ffc4710c33838df3d6b1f5' },
				{ index: 2, title: '玩法模组', key: 'content', img: 'b9d692a8348d639843f5c67c0ec03587' },
				{ index: 3, title: '优化模组', key: 'fix', img: '2d9743b1b9af10029f33e5b58eef5bed' },
			],
		};
	else if (cata === 'plugins')
		return {
			body: [
				{ index: 1, title: '辅助插件', key: 'help', img: '681e020597ffc4710c33838df3d6b1f5' },
				{ index: 2, title: '玩法插件', key: 'content', img: 'b9d692a8348d639843f5c67c0ec03587' },
				{ index: 3, title: '优化插件', key: 'fix', img: '2d9743b1b9af10029f33e5b58eef5bed' },
			],
		};
	else return { status: 404, body: null };
};
