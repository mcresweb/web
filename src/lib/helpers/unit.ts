export const storeUnit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] as const;
export type storeUnitType = typeof storeUnit[number];
/**
 * 容量单位换算
 * @param size 原始大小
 * @param unit 原始单位
 * @returns
 */
export const changeStoreUnit = (size: number, unit: storeUnitType, precision = 3) => {
	let u0 = storeUnit.indexOf(unit);
	if (u0 < 0 || size <= 0 || typeof size !== 'number') return `${size} ${unit}`;
	while (size > 1024 && u0 + 1 < storeUnit.length) (size /= 1024), u0++;
	while (size < 1 && u0 > 0) (size *= 1024), u0--;
	return `${parseFloat(size.toPrecision(precision))} ${storeUnit[u0]}`;
};
