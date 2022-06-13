/**时间(时间戳/不指定) */
export type Time = number | undefined;
/** 时间区间 */
export type TimeRange = [Time, Time];

export const filterTime = (tr: TimeRange | undefined): TimeRange | undefined =>
	tr && tr.some((x) => typeof x === 'number') ? tr : undefined;
