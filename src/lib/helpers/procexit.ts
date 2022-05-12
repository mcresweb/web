/**结束钩子*/
const runs: HookFunc[] = [];
/**
 * 添加结束时调用的钩子
 * @param func 结束时调用的函数钩子
 */
export const exitHook = (func: HookFunc) => {
	if (!(func instanceof Function)) throw new Error('func must be a function');
	runs.push(func);
};
type HookFunc = (id: number | any) => void | Promise<void> | any;
/**是否已经执行结束程序*/
let _endFlag = false;
/**
 * 退出函数
 * @param id 退出代码
 * @returns 退出等待
 */
export const exit = async function (id: number | any): Promise<void> {
	if (_endFlag) return;
	_endFlag = true;
	console.log('PROCESS', '控制面板正在结束与回收资源,请稍等...');

	for (const i in runs) {
		try {
			const func = runs[i];
			await func(id);
		} catch (err) {
			console.error('PROCESS - 无法运行清理钩子', err);
		}
	}
	// 保存
	console.log('PROCESS', 'EXIT...');
	process.exit(isNaN(id) ? 0 : parseInt(id));
};
process.on('SIGINT', exit);
