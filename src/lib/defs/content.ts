/**
 * 一个大分类信息
 */
export type Catalogue = {
	/**大分类ID (影响排序) */
	index: number;
	/**大分类标题 */
	title: string;
	/**大分类唯一标识 */
	key: string;
	/**大分类的图片*/
	img: string;
};
/**
 * 一个小分类信息
 */
export type Category = {
	/**小分类ID (影响排序) */
	index: number;
	/**小分类标题 */
	title: string;
	/**小分类唯一标识 */
	key: string;
	/**小分类的图片*/
	img: string;
};
/**
 * 内容列表
 */
export type EssayList = {
	/** 页数 */
	page: number;
	/** 内容列表 */
	list: {
		/** 内容ID (唯一, 影响排序, 降序) */
		id: number;
		/** 发布者用户名 */
		sender: string;
		/** 内容标题 */
		title: string;
		/** 评分 */
		star?: number;
		/** 下载数 */
		download: number;
		/** 内容图片 */
		img: string;
	}[];
};

/**
 * 一个内容的完整数据
 */
export type Essay = {
	/** 内容ID(唯一) */
	id: number;
	/** 大分类 */
	catalogue: string;
	/** 小分类 */
	category: string;
	/** 发布者UUID */
	sender: string;
	/** 内容标题 */
	title: string;
	/** 评分 */
	star?: number;
	/** 评分人数 */
	starAmount?: number;
	/** 下载数 */
	download: number;
	/** 介绍图片 */
	imgs: string[];
	/** 内容文章 */
	content: string;
	/** 内容文章的类型 */
	type: ContentType;
	/** 内容标签 */
	tags?: string[];
	/** 简略描述 */
	description?: string;
};

/** 允许的文章类型 */
export const contentType = ['markdown', 'html', 'bbcode', 'text'] as const;
/** 允许的文章类型 */
export type ContentType = typeof contentType[number];
