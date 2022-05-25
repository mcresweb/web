'use strict';
//本脚本用于更新图标定义

import fs from 'fs';
/** @type {{id:string;name:string;font_family:string;css_prefix_text:string;description:string;glyphs:readonly{icon_id:string;name:string;font_class:string;unicode:string;unicode_decimal:number;}[];}}*/
const info = JSON.parse(fs.readFileSync('.\\assets\\iconfont.json', 'utf8'));

/** 前缀 */
const prefix = JSON.stringify('#' + info.css_prefix_text);
/**所有图标*/
const icons = info.glyphs
	.map((icon) => ({ id: icon.font_class, name: icon.name }))
	.map((icon) => `${JSON.stringify(icon.id)}:${JSON.stringify(icon.name)}`)
	.join(',');
/** 所有图标ID */
const iconKeys = info.glyphs.map((icon) => JSON.stringify(icon.font_class)).join(',');

/** 文件内容 */
const file = [
	`/** 图标信息, id - 名称 */`,
	`export type IconInfos = {${icons}};`,
	`/** 图标信息, id - 名称 */`,
	`export const infos: IconInfos = {${icons}} as const;`,
	`/** 图标ID */`,
	`export type Icons = keyof IconInfos;`,
	`/** 图标ID */`,
	`export const icons = [${iconKeys}] as const;`,
	`/** 获取一个图标的名称 */`,
	`export const getName = <K extends Icons>(id: K): IconInfos[K] => infos[id];`,
	`/** 获取所有的ID(动态获取) */`,
	`export const getIds = (): Icons => [...icons] as unknown as Icons;`,
	`/** 图标前缀 */`,
	`export type IconPrefixType = ${prefix};`,
	`/** 图标前缀 */`,
	`export const IconPrefix: IconPrefixType = ${prefix};`,
	``,
].join('\n');

fs.writeFileSync('./src/lib/defs/iconfont.ts', file, 'utf8');
