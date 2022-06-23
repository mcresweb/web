/**
 * 搜索结果
 */
export type SearchResult = {
	/**
	 * 命中数量/错误信息
	 *
	 * 当此字段为纯数字时, 则为命中数量, 否则为错误信息
	 */
	hits: string;
	/** 是否存在更多的命中数量 */
	hasMore: boolean;
	/** 搜索展示 */
	docs: SearchDoc[] | null;
	/** 冷却提示(ms) */
	cooling?: number;
};
/**
 * 搜索文档结果
 */
export type SearchDoc = {
	/**文档内容 */
	doc: {
		id: string;
		title: string;
		tags?: string | string[];
		content: string;
		description: string;
		senderID: string;
	};
	/**文档ID */
	id: string;
	/**匹配得分 */
	score: number;
};
