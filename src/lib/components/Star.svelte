<script lang="ts">
	import Icon from './Icon.svelte';

	/** star数量 */
	export let star: number;
	/** 总数量 */
	export let amt: number = 5;
	/** 小数点位数 */
	export let fix: number = 2;

	export let small: boolean = false;

	/** 处理后的小数点位数(10^fix) / false(非small) */
	let fix0: number | false;
	/** 处理后的数据(在[0,amt]范围内, 规范小数点(仅small)) */
	let val: number;
	$: fix0 = small && Math.pow(10, fix | 0);
	$: val = Math.max(Math.min(star, amt), 0);
	$: val = fix0 === false ? val : ((val * fix0) | 0) / fix0;
</script>

<span class="x">
	{#if small}
		<span class="small">
			<div class="bg"><Icon icon="shoucangjia" /></div>
			<div class="star" style:width="{(val / (amt | 0)) * 100}%">
				<Icon icon="shoucangjia" />
			</div>
		</span>
		<span class="small">&nbsp;{val}</span>
	{:else}
		<div class="bg">
			{#each Array(amt | 0) as _}
				<Icon icon="shoucangjia" />
			{/each}
		</div>
		<div class="star" style:width="{(val / (amt | 0)) * 100}%">
			{#each Array(amt | 0) as _}
				<Icon icon="shoucangjia" />
			{/each}
		</div>
	{/if}
</span>

<style>
	* {
		position: relative;
	}
	.x {
		display: inline-block;
	}
	.small {
		display: inline-block;
		vertical-align: top;
	}
	.bg,
	.star {
		display: inline;
		left: 0;
		top: 0;
		z-index: 0;
		height: 100%;
		word-wrap: normal;
		word-break: keep-all;
		float: left;
		white-space: nowrap;
	}
	.star {
		color: red;
		position: absolute;
		z-index: 1;
		overflow: hidden;
	}
</style>
