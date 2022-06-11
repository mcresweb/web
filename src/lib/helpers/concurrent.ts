/**
 * 运行所有任务
 * @param opt 任务选项/并发数
 * @param tasks 任务
 */
export const runAll = (opt: runOption = 4, ...tasks: task[]) => {
	let limit = (typeof opt === 'number' ? opt : opt.limit) || 4;
	const overCallback = typeof opt === 'number' ? undefined : opt.overCallback;
	if (!(limit > 0)) limit = 4;
	let now = Math.min(limit, tasks.length);
	const pool = tasks.slice(limit);
	const then = () => {
		const func = pool.shift();
		if (func) {
			func().then(then);
		} else now--;
		if (overCallback && now <= 0) overCallback();
	};
	tasks.slice(0, limit).forEach((task) => task().then(then));
	return (...tasks: task[]) => {
		const free = limit - now;
		now += Math.min(free, tasks.length);
		pool.push(...tasks.slice(free));
		tasks.slice(0, free).forEach((task) => task().then(then));
	};
};
/** 运行选项 */
type runOption =
	| {
			/** 并发数 */
			limit?: number;
			/**
			 * 完成回调
			 *
			 * 每次全部运行完毕时调用
			 */
			overCallback?: () => unknown;
	  }
	| number;
export type task = () => Promise<void>;
