/**
 * 延时函数
 * @param t 延时毫秒数 (默认为1ms)
 * @returns 返回延时的毫秒数
 */
export const delay = (t: number = 1) => new Promise<number>((r) => setTimeout(() => r(t), t));
