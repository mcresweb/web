import { dev } from '$app/env';
import fs from 'fs';
import { Document, isMap, isScalar, parse } from 'yaml';
import { initFinish, startWaiter } from '../helpers/initer';
import deepmerge from 'deepmerge';
import { setApiUrl } from './FetchFunction.type';

/**默认配置文件*/
const confDefault = {
	/** 网站标题 */
	title: '我的世界资源网站',
	API_URL: 'http://localhost',
};
/**配置文件描述*/
const confComment: Comment = {
	__node_comment__: '前端配置文件',
	title: '网站标题',
	API_URL: '后端地址(仅由前端服务器使用, 可以指定反向代理/直接地址)',
};
/**配置文件*/
export let config: Config;

(async () => {
	await startWaiter;

	const file = './config.yml';
	if (dev || !fs.existsSync(file)) {
		const yaml = new Document(confDefault);

		/** 添加描述 */
		const addComment = (yaml: unknown, node: any) => {
			if (!isMap(yaml)) throw new Error('Bad Node: ' + yaml);
			yaml.items.forEach((pair) => {
				if (!isScalar(pair.key)) throw new Error('Bad key: ' + pair.key);
				if (typeof pair.key.value !== 'string') throw new Error('Bad key: ' + pair.key.value);
				const data: string | CommentNode<unknown> = node[pair.key.value];

				pair.key.spaceBefore = true;
				if (typeof data === 'string') {
					pair.key.commentBefore = data;
				} else if (data) {
					pair.key.commentBefore = data.__node_comment__;
					addComment(pair.value, data);
				}
			});
		};
		addComment(yaml.contents, confComment);
		yaml.commentBefore = confComment.__node_comment__;
		// if (dev) console.log(yaml.toString());
		fs.writeFileSync(file, yaml.toString(), 'utf8');
	}
	const confUser = parse(fs.readFileSync(file, 'utf8'), {});
	config = deepmerge(confDefault, confUser, { arrayMerge: (_def, user) => user, clone: true });

	setApiUrl(config.API_URL);

	initFinish('conf');
})();

/**
 * 配置文件结构
 */
export type Config = typeof confDefault;
/**
 * 结构节点描述
 *
 * 需要拥有与指定结构一致的结构, 但所有基础类型及数组都被替换为字符串
 */
export type CommentNode<T> = {
	[k in keyof T]: T[k] extends object
		? T[k] extends Array<any>
			? string
			: CommentNode<T[k]>
		: string;
} & { __node_comment__: string };

/** 配置文件结构描述 */
export type Comment = CommentNode<Config>;
