<script lang="ts">
	import { filterTime, type TimeRange } from '$defs/time';

	import Datetime from './Datetime.svelte';

	/**aria-invalid*/
	export let invalidMin: boolean | undefined = undefined;
	/**aria-invalid*/
	export let invalidMax: boolean | undefined = undefined;

	export let label: string | undefined = undefined;

	/**
	 * 时间区间
	 *
	 * 在均未指定时为`undefined`,
	 * 并且如果输入`[undefined,undefined]`也会被强制转换为`undefined`并响应
	 */
	export let time: TimeRange | undefined;
	/**内部绑定对象*/
	$: time0 = time || ([undefined, undefined] as TimeRange);
	$: if (
		time === undefined //undefined判断
			? time0.some((x) => x !== undefined)
			: time0.every((x) => x === undefined)
	)
		setTime();
	const setTime = () => (time = filterTime(time0));
</script>

<div>
	{#if label}
		<legend>{label}</legend>
	{/if}
	<div>
		<span><Datetime bind:time={time0[0]} invalid={invalidMin} /></span><span class="to">到</span
		><span><Datetime bind:time={time0[1]} invalid={invalidMax} /></span>
	</div>
</div>

<style>
	div {
		width: 100%;
		position: relative;
	}
	span {
		position: relative;
		display: inline-block;
		width: 45%;
		height: 100%;
	}
	span.to {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 8%;
		text-align: center;
		padding: var(--form-element-spacing-vertical) 0;
	}

	span:last-child {
		margin-left: 8%;
	}
	@media (max-width: 768px) {
		span,
		span:last-child,
		span.to {
			width: 100%;
			margin-left: 0;
			position: relative;
			padding: 0;
		}
		span:first-child :global(input) {
			margin-bottom: 0;
		}
	}
</style>
