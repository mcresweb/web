import type { FetchFunction } from '$defs/FetchFunction.type';
import type { MeInfo, UserInfo } from '$defs/user';

/**
 * 获取自身数据
 * @param f fetch
 * @returns 用户数据
 */
export const getMe = async (f: FetchFunction): Promise<MeInfo> => {
	const resp = await f('/api/user/me');
	if (!resp.ok) throw new Error();
	return await resp.json();
};
/**
 * 获取其他用户数据
 * @param f fetch
 * @param uuid 用户UUID
 * @returns 用户数据 / 找不到用户
 */
export const getInfo = async (f: FetchFunction, uuid: string): Promise<UserInfo | null> => {
	const resp = await f(`/api/user/info?id=${uuid}`);
	if (!resp.ok) return null;
	return await resp.json();
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
	return f('/api/user/logout');
};
