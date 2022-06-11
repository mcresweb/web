export const transferKey = 'data-mrw';
/**
 * 开始拖动(发起方使用)
 *
 * ```js
 * on:dragstart={(e)=>dragstart(e,"数据")}
 * ```
 * @param e 拖动事件
 * @param text 传输数据
 */
export const dragstart = (e: DragEvent, text: string, img?: Element) => {
	const dt = e.dataTransfer!;
	dt.clearData();
	dt.effectAllowed = 'all';
	dt.setData(transferKey, text);
	if (img) {
		let x = 0,
			y = 0;
		if (img instanceof HTMLImageElement) {
			x = img.width / 2;
			y = img.height / 2;
		}
		dt.setDragImage(img, x, y);
	}
};
/**
 * 允许drop
 *
 * ```js
 * on:dragover={allowDrop}
 * ```
 * @param e 拖动事件
 */
export const allowDrop = (e: DragEvent) => e.preventDefault();
/**
 * 停止拖动
 *
 * ```js
 * on:drop={(e)=>drop(e,(data)=>alert(data))}
 * ```
 * @param e 拖动事件
 * @param callback 回调
 */
export const drop = (e: DragEvent, callback: (text: string) => unknown) => {
	e.preventDefault();
	const dt = e.dataTransfer!;
	const data = dt.getData(transferKey);
	callback(data);
};
