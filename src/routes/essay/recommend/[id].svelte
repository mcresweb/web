<script context="module" lang="ts">
	import { browser } from '$app/env';
	import {
		EssayRecommendInfo,
		EssayRecommendInfoKey,
		type Essay,
		type EssayRecommendList,
	} from '$defs/content';
	import { delay } from '$helpers/delay';
	import {
		addEssayRecommend,
		contentUrl,
		essayUrl,
		getCatalogueByKey,
		getCategoryByKey,
		getEssay,
		recommendEssayInfo,
	} from '$lib/api/content';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params }) => {
		const { id } = params;
		const essay = await getEssay(fetch, parseInt(id));
		if (!essay) {
			return { status: 404, error: `找不到ID为 ${params.id} 的内容` };
		}
		if (!browser) return { props: { essay } };
		const info = await recommendEssayInfo(fetch, parseInt(id));
		return { props: { essay, info } };
	};
</script>

<script lang="ts">
	import Datetime from '$components/Datetime.svelte';

	export let info: EssayRecommendList['list'][number] | null;
	export let essay: Essay;
	$: hasRecommend = info && info.expire > Date.now();

	/**编辑的过期时间*/
	let expire: number | undefined = undefined;

	let pushing = false;
	const setER = async (exp?: number) => {
		pushing = true;
		expire = undefined;
		await addEssayRecommend(fetch, essay.id, exp);
		info = await recommendEssayInfo(fetch, essay.id);
		pushing = false;
	};
</script>

<div class="container">
	<article>
		<a style:float="right" href={essayUrl(essay.id)}>返回</a>
		<h1>编辑推荐</h1>
		<p>
			{essay.title}
			<br />
			{#await delay()}
				{essay.catalogue} &gt; {essay.category}
			{:then}
				<a href={contentUrl(essay.catalogue)}>
					{#await getCatalogueByKey(fetch, essay.catalogue)}
						{essay.catalogue}
					{:then catalogue}
						{catalogue?.title || essay.catalogue}
					{/await}
				</a>
				&gt;
				<a href={contentUrl(essay.catalogue, essay.category)}>
					{#await getCategoryByKey(fetch, essay.catalogue, essay.category)}
						{essay.category}
					{:then category}
						{category?.title || essay.category}
					{/await}
				</a>
			{/await}
		</p>
		{#if browser}
			<h3>当前状态: {hasRecommend ? '推荐中' : '暂未被推荐'}</h3>
			{#if hasRecommend && info}
				<table>
					<tbody>
						{#each EssayRecommendInfoKey as key}
							{@const x = EssayRecommendInfo[key]}
							<tr>
								<td>{x?.name}</td>
								<td>{x?.t ? x.t(info[key]) : info[key]}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
			<Datetime bind:time={expire} label="过期时间" />
			<div class="grid">
				<button
					data-tooltip="移除此内容的推荐状态"
					disabled={pushing}
					class="secondary"
					on:click={() => setER()}
				>
					移除
				</button>
				{#if hasRecommend}
					<button
						data-tooltip="将此内容提升至推荐列表顶部"
						disabled={pushing}
						on:click={() => setER(info?.expire)}
					>
						提升
					</button>
				{/if}
				<button
					data-tooltip="设置此内容的推荐状态"
					disabled={pushing || (expire || 0) <= Date.now()}
					on:click={() => setER(expire)}
				>
					{hasRecommend ? '修改' : '添加'}
				</button>
			</div>
			{#if pushing}<span aria-busy="true">正在提交数据...</span>{/if}
		{/if}
	</article>
</div>
