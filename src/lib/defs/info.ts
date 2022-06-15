/**
 * 基础信息
 */
export type BasicInfo = {
	/**分类数量 */ catalogue: string;
	/**内容数量 */ essay: string;
	/**用户数量 */ user: string;
	/**建站天数 */ day: string;
	/**今日访问 */ visit: string;
};
/**基础信息名称 */
export const BasicInfoNames: Record<keyof BasicInfo, string> = {
	catalogue: '分类数量',
	essay: '内容数量',
	user: '用户数量',
	day: '建站天数',
	visit: '今日访问',
};

/**
 * 注册信息
 */
export type RegisterInfo = {
	/**用户名最大长度*/ nameLen: number;
};
