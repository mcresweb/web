/**
 * 自身已登录数据
 */
export type MeLoginInfo = {
	/** 已登录 */ login: true;
	/** 用户UUID */ id: string;
	/** 用户名 */ name: string;
	/** 用户邮箱 */ email: string;
	/** 是否是管理员 */ admin: boolean;
	/** 是否是VIP */ vip: boolean;
	/** 是否被锁定 */ lock: boolean;
};
/**
 * 自身数据
 */
export type MeInfo = { /** 未登录 */ login: false } | MeLoginInfo;

/**
 * 其他用户的信息
 */
export type UserInfo = {
	/** 用户UUID */ id: string;
	/** 用户名 */ name: string;
	/** 是否是管理员 */ admin: boolean;
	/** 是否是VIP */ vip: boolean;
	/** 是否被锁定 */ lock: boolean;
};
