<script lang="ts">
	/**YYYY-MM-DD 的长度*/
	const dateWidth = [4, 2, 2] as const;

	/**
	 * 选定时间的时间戳
	 *
	 * `undefined`: 未选定
	 */
	export let time: number | undefined;

	/**label*/
	export let label: string | undefined = undefined;

	/**aria-invalid*/
	export let invalid: boolean | undefined = undefined;

	/**字符串形式*/
	let str = time2DTstr(time);

	/**旧时间戳*/
	$: time_old = DTstr2Time(str);
	$: time = time_old;

	/**外部修改*/
	$: if (time !== time_old) updateTime(time);

	function updateTime(time: number | undefined) {
		str = time2DTstr(time);
	}

	/**时间戳转datetime字符串*/
	function time2DTstr(time: number | undefined): string {
		if (typeof time === 'undefined' || isNaN(time)) return '';
		const date = new Date(time);
		return `${date
			.toLocaleDateString()
			.split(/[^0-9]/)
			.map((str, i) => str.padStart(dateWidth[i], '0'))
			.join('-')}T${date.toLocaleTimeString()}`;
	}
	/**datetime字符串转时间戳*/
	function DTstr2Time(str: string): number | undefined {
		const t = str && new Date(str).getTime();
		return typeof t === 'number' && !isNaN(t) ? t : undefined;
	}

	const pattern = `${dateWidth.map((w) => `[0-9]{${w}}`).join('-')}T${Array(3)
		.fill('[0-9]{2}')
		.join(':')}`;
</script>

<label>
	{label || ''}
	<input type="datetime-local" bind:value={str} {pattern} aria-invalid={invalid} />
</label>
