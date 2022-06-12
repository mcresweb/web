/**
 * 提交状态
 */
export type SubmitStat = {
	/** 提交名称 */
	name: string;
	/** 是否结束 */
	over?: true;
	/** 显示信息 */
	msg: string;
	/** 当前进度, undefined 代表未知进度, 负数代表失败 */
	now?: number;
	/** 总进度, 正整数, undefined 与 0 默认为 1 */
	tot?: number;
};
/**
 * 提交状态更新器
 */
export type SubmitStatUpdater = <T extends keyof SubmitStat>(type: T, val: SubmitStat[T]) => void;
/**
 * 文件上传方法定义
 */
export type FileUploaderFunc<T> = (
	data: T,
	statCb?: (stats: Record<string, SubmitStat>) => unknown,
) => Promise<boolean>;
/**
 * 文件上传方法定义
 */
export type SimpleFileUploaderFunc<T> = (
	statCb?: (stats: SubmitStat) => unknown,
	data?: T,
) => Promise<boolean>;
/**
 * 创建文件读取器
 * @param update 状态更新器
 * @param r 全部完毕的回调函数
 * @param submit 提交文件内容
 * @returns 文件读取器
 */
export const newFileReader = (
	update: SubmitStatUpdater,
	r: () => void,
	submit: (fr: FileReader) => Promise<{ success: boolean; msg: string }>,
): FileReader => {
	const fr = new FileReader();
	fr.onloadstart = () => update('msg', '读取中');
	fr.onprogress = (ev) => {
		if (ev.lengthComputable) {
			update('now', ev.loaded);
			update('tot', ev.total);
		} else {
			update('now', undefined);
			update('tot', 1);
		}
	};
	fr.onabort = () => (update('msg', '已终止!'), update('now', -1), r());
	fr.onerror = () => (update('msg', '读取错误!'), update('now', -1), r());
	fr.onload = async () => {
		update('msg', '上传处理中');
		update('now', undefined);
		update('tot', 1);
		const resp = await submit(fr);
		update('now', resp.success ? 1 : -1);
		update('msg', resp.msg);
		update('over', true);
		r();
	};
	return fr;
};
