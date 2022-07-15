<script lang="ts">
	import type { Catalogue, Category } from '$defs/content';
	import { essayUrl, listEssay } from '$lib/api/content';
	import { imgUrl } from '$lib/api/img';
	import Thumbnail from './Thumbnail.svelte';
	import { fly, type FlyParams } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Star from './Star.svelte';
	import PageNumber from './PageNumber.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Icon from './Icon.svelte';
	const flyData: FlyParams = { y: 100, duration: 800, easing: quintOut, delay: 150 };

	/** 大分类 */
	export let catalogue: Catalogue;
	/** 小分类 */
	export let category: Category;

	/** 当前页码 */
	export let nowPage: number = parseInt($page.url.searchParams.get('p') || '1');

	const imgShow: boolean[] = [];

	const goPage = (p: number) => {
		nowPage = p;
		$page.url.searchParams.set('p', `${p}`);
		history.replaceState($page.url, '');
	};
</script>

<main class="essay_list container-fluid">
	{#await listEssay(fetch, catalogue.key, category.key, nowPage)}
		<span aria-busy="true">加载中...</span>
	{:then essay}
		{#if !essay}
			<h1 style:color="var(--bs-red)">啊哦, 页面出错了!</h1>
		{:else if essay?.list?.length > 0}
			<PageNumber {nowPage} allPage={essay.page} onChange={goPage} />
			<div class="row" in:fly={flyData}>
				{#each essay.list as ess (ess.id)}
					{@const src = imgUrl(ess.img)}
					<div class="essay col-md-6 col-lg-4 col-xxl-3" on:click={() => goto(essayUrl(ess.id))}>
						<img class="bg" src={imgShow[ess.id] ? src : undefined} alt="" />
						<article>
							<Thumbnail {src} bind:show={imgShow[ess.id]} />
							<div class="title">{ess.title}</div>
							<div class="info">
								{#if ess.star}
									<span><Star star={ess.star} small /></span>
								{/if}
								<span>
									<Icon icon="xiazai" />
									{ess.download}
								</span>
								<span>
									{ess.sender}
								</span>
							</div>
						</article>
					</div>
				{/each}
			</div>
			<PageNumber {nowPage} allPage={essay.page} onChange={goPage} />
		{:else if essay.page > 0}
			<h1 style:color="var(--bs-red)">啊哦, 您输入了一个错误的页码!</h1>
		{:else}
			<h1 style:color="var(--bs-red)">啊哦, 这个分类下还没有内容呢!</h1>
		{/if}
	{/await}
</main>

<style>
	.essay_list {
		padding: 10px 8vw;
	}
	.essay {
		--essay-big: 1vw;
		cursor: pointer;
		padding: var(--essay-big);
		margin: 0;
		border-radius: 5px;
		position: relative;
		transition: padding 0.3s;
		line-height: 2em;
	}
	.essay:hover {
		--essay-big: 0.6vw;
	}
	.essay:hover .bg {
		transition: opacity 0.2s;
		opacity: 0.5;
	}

	.essay .bg {
		--shadow-size: 3px;
		position: absolute;
		width: calc(100% - calc(15px - var(--shadow-size)));
		height: calc(100% - calc(15px - var(--shadow-size)));
		left: calc(15px - var(--shadow-size));
		top: calc(15px - var(--shadow-size));
		z-index: -1;
		opacity: 0;
		filter: blur(30px);
	}
	.essay article {
		padding: 15px;
		margin: 0;
	}
	.essay .title {
		text-align: center;
		width: 100%;
		word-break: keep-all;
		word-wrap: normal;
		overflow: hidden;
	}
	.essay .info {
		font-size: 0.7em;
		display: table;
		padding: 4px 0;
		width: 100%;
	}
	.essay .info > * {
		display: table-cell;
		margin: 0 auto;
		text-align: center;
	}
	.essay .info > *:first-child {
		text-align: left;
	}
	.essay .info > *:last-child {
		text-align: right;
	}
</style>
