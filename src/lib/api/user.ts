import { API_URL, type FetchFunction } from '$defs/FetchFunction.type';
import type {
	LoginRequest,
	LoginResp,
	MeInfo,
	RegisterRequest,
	RegisterResp,
	SaltInfo,
	SetVaptchaRequest,
	UserInfo,
	VipInfo,
} from '$defs/user';

/**
 * 获取自身数据
 * @param f fetch
 * @returns 用户数据
 */
export const getMe = async (f: FetchFunction): Promise<MeInfo> => {
	const resp = await f(API_URL + '/api/user/me');
	if (!resp.ok) throw new Error();
	return await resp.json();
};
/**
 * 获取其他用户数据
 * @param f fetch
 * @param id 用户ID
 * @returns 用户数据 / 找不到用户
 */
export const getInfo = async (f: FetchFunction, id: number): Promise<UserInfo | null> => {
	const resp = await f(`${API_URL}/api/user/info?id=${id}`);
	if (!resp.ok) return null;
	return await resp.json();
};
/**
 * 获取服务器登录信息
 * @param f fetch
 * @returns 登录信息
 */
export const getSalt = async (f: FetchFunction): Promise<SaltInfo> => {
	const resp = await f(`${API_URL}/api/user/salt`);
	if (!resp.ok) throw new Error();
	return await resp.json();
};

/**
 * 获取自身VIP信息
 * @param f fetch
 * @returns VIP信息
 */
export const getMyVip = async (f: FetchFunction): Promise<VipInfo | null> => {
	const resp = await f(`${API_URL}/api/user/me-vip`);
	if (!resp.ok) return null;
	return await resp.json();
};

/**
 * 登录
 * @param f fetch
 * @param data 登录数据
 */
export const doLogin = async (f: FetchFunction, data: LoginRequest): Promise<LoginResp> => {
	const resp = await f(`${API_URL}/api/user/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (resp.ok) return resp.json();
	return { success: false, err: `${resp.status} - ${await resp.text()}` };
};

/**
 * 注册
 * @param f fetch
 * @param data 注册数据
 */
export const doRegister = async (
	f: FetchFunction,
	data: RegisterRequest,
): Promise<RegisterResp> => {
	const resp = await f(`${API_URL}/api/user/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	if (resp.ok) return resp.json();
	return { success: false, err: `${resp.status} - ${await resp.text()}` };
};
/**
 * 发送邮箱验证码
 * @param f fetch
 * @param email 邮箱
 * @returns 成功(true)/失败(false)/失败消息(string)
 */
export const sendEmailCheckCode = async (
	f: FetchFunction,
	email: string,
): Promise<boolean | string> => {
	const resp = await f(`${API_URL}/api/user/check-email?email=${encodeURIComponent(email)}`);
	if (!resp.ok) return `${resp.status} - ${await resp.text()}`;
	return !!resp.json();
};

/**
 * 登录地址
 *
 * ```javascript
 * '/user/login'
 * ```
 *
 * @returns url
 */
export const loginUrl = () => '/user/login';

/**
 * 执行登出
 * @param f fetch
 */
export const doLogout = (f: FetchFunction) => {
	return f(API_URL + '/api/user/logout');
};

/**
 * 获取验证码的VID
 * @param f fetch
 * @returns VID
 */
export const getVaptchaID = async (f: FetchFunction): Promise<string> => {
	const resp = await f(API_URL + '/api/user/vaptcha');
	if (!resp.ok) return '';
	return await resp.text();
};
/**
 * 设置验证码数据(仅admin)
 * @param f fetch
 */
export const setVaptchaID = async (f: FetchFunction, data: SetVaptchaRequest): Promise<void> => {
	await f(API_URL + '/api/user/vaptcha', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
};

/**
 * 生成初始化服务器的临时验证码
 * @param f fetch
 * @returns 生成路径
 */
export const summonInitCode = async (f: FetchFunction): Promise<string> => {
	const resp = await f(`${API_URL}/api/user/register-admin`);
	return await resp.text();
};

/**
 * 注册管理员
 * @param f fetch
 * @param code 初始化服务器的临时验证码
 * @param data 注册数据
 */
export const doAdminRegister = async (
	f: FetchFunction,
	code: string,
	data: RegisterRequest,
): Promise<RegisterResp> => {
	const resp = await f(`${API_URL}/api/user/register-admin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'admin-code': code,
		},
		body: JSON.stringify(data),
	});
	if (resp.ok) return resp.json();
	return { success: false, err: `${resp.status} - ${await resp.text()}` };
};
