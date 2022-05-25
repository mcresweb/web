/**
 * 基础信息
 */
export type BasicInfo = {
	/**分类数量 */ catalogue: number;
	/**内容数量 */ essay: number;
	/**用户数量 */ user: number;
	/**建站天数 */ day: number;
};

/**
 * 注册信息
 */
export type RegisterInfo = {
	/**用户名最大长度*/ nameLen: number;
};
