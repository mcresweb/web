import type { TimeRange } from './time';

/**
 * 平台信息
 */
export type Platform = {
	/**平台名称 */
	name: string;
	/**平台地址 */
	url: string;
	/**平台图片 */
	img: string;
	/**平台描述 */
	info: string;
};

/**
 * 使用请求
 */
export type UseReq = { token: string };
/**
 * 使用响应
 */
export type UseResp = { success: true; expire: number } | { success: false; err: string };

/**
 * 生成请求
 */
export type SummonReq = {
	/**生成数量 */
	amount: number;
	/**生成价值（VIP天数） */
	value: number;
	/**过期时间 */
	expire?: number;
};
/**
 * 搜索请求
 */
export class SearchReq {
	/**
	 * 指定token类型
	 *
	 * 0或未指定代表全部, 1代表已使用, 2代表未使用
	 */
	used?: boolean;
	/**生成者ID / 用户名 / 邮箱*/
	summoner?: number | string;
	/**使用者ID / 用户名 / 邮箱*/
	user?: number | string;
	/** 页码(从1开始) */
	page: number = 1;

	/**生成时间 */
	summonTime?: TimeRange;
	/**过期时间 */
	expireTime?: TimeRange;
	/**使用时间 */
	useTime?: TimeRange;
}

/** 会员码信息 */
export type TokenInfo = {
	token: string;
	summonTime: number;
	summoner: number;
	value: number;
	expire: number;
	used: boolean;
	user?: number;
	usedTime?: number;
} & ({ used: true; user: number; usedTime: number } | { used: false });

/**搜索结果名称*/
export const TokenInfoName: Record<keyof TokenInfo, string> = {
	value: '价值',
	used: '已使用',
	expire: '到期时间',
	summoner: '生成者',
	summonTime: '生成时间',
	token: '会员码',
	user: '使用者',
	usedTime: '使用时间',
};
/**搜索结果键*/
export const TokenInfoKeys = Object.keys(TokenInfoName) as (keyof TokenInfo)[];

/** 搜索结果转换 */
export const TokenInfoTrans: {
	[k in keyof typeof TokenInfoName]: (data: any, detail?: any) => any;
} = (() => {
	const trans: { [k in keyof typeof TokenInfoName]: (data: TokenInfo[k], detail?: any) => any } = {
		value: (x) => x,
		used: (x) => (x ? '是' : '否'),
		expire: (x) => new Date(x).toLocaleString(),
		summoner: (x) => x,
		summonTime: (x) => new Date(x).toLocaleString(),
		token: (x, detail) => (detail ? x : x.substring(x.length - 10, x.length)),
		user: (x) => x || '',
		usedTime: (x) => (x && new Date(x).toLocaleString()) || '',
	};
	return trans;
})();

/**搜索响应 */
export type SearchResp = {
	/**总页码 */
	page: number;
	/**总数量 */
	amount: number;
	/**当前页信息 */
	list: TokenInfo[];
};
