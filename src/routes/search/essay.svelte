<script context="module" lang="ts">
	import { searchEssay } from '$lib/api/search';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ url, fetch }) => {
		if (!browser || !url.searchParams.has('t')) return { props: { data: null } };
		const data = await searchEssay(fetch, url.search);
		return { props: { data } };
	};
</script>

<script lang="ts">
	import type { SearchResult } from '$defs/search';
	import { page } from '$app/stores';
	import { browser, dev } from '$app/env';
	import SearchEssayList from '$components/SearchEssayList.svelte';
	import { onMount } from 'svelte';

	/**搜索结果数据*/
	export let data: SearchResult | null | undefined;

	/**当前冷却时长(ms)*/
	let cooling: number;
	onMount(() => {
		const coolTime = (cooling = data?.cooling || 0);
		if (coolTime <= 0) return;
		const start = Date.now();
		const timer = setInterval(() => {
			const now = Date.now();
			cooling = coolTime - (now - start);
			if (cooling <= 0) (cooling = 0), clearInterval(timer);
		}, 50);
		return () => clearInterval(timer);
	});
</script>

{#if data && /^[0-9]+$/.test(data.hits)}
	<div class="container">
		<article>
			<div class="headings">
				<h1>
					搜索:&nbsp;<span style:color="var(--bs-red)">{$page.url.searchParams.get('t')}</span>
				</h1>
				<h2>共找到&nbsp;{data.hits}{data.hasMore ? '+' : ''}&nbsp;个相关内容</h2>
			</div>
			{#if cooling > 0}
				<small style:float="right">
					<i>
						搜索冷却 {(cooling / 1000).toFixed(2)} s
					</i>
				</small>
			{/if}
		</article>
	</div>

	<SearchEssayList docs={data.docs} />
	{#if dev}
		<article>
			<h1>开发者模式数据</h1>
			<pre>{JSON.stringify(data, null, 4)}</pre>
		</article>
	{/if}
{:else if data}
	<div class="container">
		<article>
			<h1 style:color="var(--bs-red)">搜索失败:&nbsp;{$page.url.searchParams.get('t')}</h1>
			无法执行搜索:
			<b>{data.hits}</b>
		</article>
	</div>
{:else if !browser}
	<div class="container">
		<span aria-busy="true">正在搜索中...</span>
	</div>
{/if}
