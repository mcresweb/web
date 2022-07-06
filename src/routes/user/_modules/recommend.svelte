<script lang="ts">
	import { browser, dev } from '$app/env';
	import PageNumber from '$components/PageNumber.svelte';
	import { listRecommendEssay } from '$lib/api/content';
	import RecommendLine from './_RecommendLine.svelte';

	let page = 1;
</script>

推荐列表:
{#if !browser}
	<span aria-busy="true">加载中...</span>
{:else}
	{#await listRecommendEssay(fetch, page - 1)}
		<span aria-busy="true">加载中...</span>
	{:then list}
		<PageNumber bind:nowPage={page} allPage={list.page} />
		{#each list.list as info}
			<RecommendLine {info} />
		{/each}
		{#if dev}
			<div>
				开发者数据:
				<pre>{JSON.stringify(list, null, 4)}</pre>
			</div>
		{/if}
	{:catch err}
		{err}
	{/await}
{/if}
