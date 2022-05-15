<script lang="ts">
	import Icon from './Icon.svelte';

	/** 最小页码 */
	export let minPage: number = 1;
	/** 当前页码 */
	export let nowPage: number;
	/** 全部页码 */
	export let allPage: number | undefined;

	/** 显示数量 */
	export let showAmt: number = 4;

	/** 当需要改变页码时触发 */
	export let onChange: (page: number) => unknown = (p) => (nowPage = p);

	$: postLimit = (showAmt / 2) | 0;
	$: preLimit = (showAmt - postLimit - 1) | 0;
	$: preAmt = Math.min(preLimit, nowPage - minPage);
	$: postAmt = Math.min(postLimit, allPage === undefined ? postLimit : allPage - nowPage);
</script>

<div>
	{#if minPage < nowPage}<span class="page" on:click={() => onChange(nowPage - 1)}
			><Icon icon="zuo" /></span
		>{#if preLimit < nowPage - minPage}<span class="page" on:click={() => onChange(minPage)}
				>{minPage}</span
			><span>..</span>{/if}{#each Array(preAmt) as _, i}{@const page = nowPage - preAmt + i}<span
				class="page"
				on:click={() => onChange(page)}>{page}</span
			>{/each}{/if}<span class="active">{nowPage}</span
	>{#if allPage === undefined || nowPage < allPage}{#each Array(postAmt) as _, i}{@const page =
				nowPage + i + 1}<span class="page" on:click={() => onChange(page)}>{page}</span
			>{/each}{#if postLimit < (allPage === undefined ? postLimit + 1 : allPage - nowPage)}<span
				>..</span
			>{#if allPage !== undefined}<span
					class="page"
					on:click={() => allPage !== undefined && onChange(allPage)}>{allPage}</span
				>{/if}{/if}<span class="page" on:click={() => onChange(nowPage + 1)}
			><Icon icon="you" /></span
		>{/if}
</div>

<style>
	span {
		padding: 1px 5px;
		display: inline-block;
		line-height: 20px;
		text-align: center;
		border-radius: 20%;
		margin: 0 3px;
	}
	span.page {
		cursor: pointer;
	}
	span.active {
		background-color: var(--bs-red);
		color: #fff;
	}
</style>
