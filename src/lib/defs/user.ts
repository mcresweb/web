/**
 * 自身已登录数据
 */
export type MeLoginInfo = {
	/** 已登录 */ login: true;
	/** 用户ID */ id: number;
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
	/** 用户ID */ id: number;
	/** 用户名 */ name: string;
	/** 是否是管理员 */ admin: boolean;
	/** 是否是VIP */ vip: boolean;
	/** 是否被锁定 */ lock: boolean;
};
/**
 * 服务器登录信息
 */
export type SaltInfo = {
	salt: string;
	time: string;
	vaptcha: string;
};

/**
 * 登录请求
 */
export type LoginRequest = {
	username: string;
	password: string;
	time: string;
};

/**
 * 注册请求
 */
export type RegisterRequest = {
	username: string;
	password: string;
	email: string;
	code: string;
};

/** 登录成功响应 */
export type LoginSuccessResp = { success: true; userid: number };
/** 登录失败响应 */
export type LoginFailResp = { success: false; err: string };
/** 登录响应 */
export type LoginResp = LoginSuccessResp | LoginFailResp;

/** 注册成功响应 */
export type RegisterSuccessResp = LoginSuccessResp;
/** 注册失败响应 */
export type RegisterFailResp = LoginFailResp;
/** 注册响应 */
export type RegisterResp = LoginResp;

/**
 * 设置验证码数据请求
 */
export type SetVaptchaRequest = {
	vid?: string;
	key?: string;
};
