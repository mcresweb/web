<script context="module" lang="ts">
	export const load: Load = async ({ fetch }) => {
		const catalogue: Record<string, Catalogue> = {};
		(await listCatalogue(fetch)).forEach((cata) => (catalogue[cata.key] = cata));
		return { props: { catalogue } };
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import type { Catalogue, Category } from '$defs/content';
	import { listCatalogue, listCategory } from '$lib/api/content';
	import type { Load } from '@sveltejs/kit';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { delay } from '$helpers/delay';
	import { browser } from '$app/env';
	import EssayList from '$components/EssayList.svelte';
	/** 所有大分类 */
	export let catalogue: Record<string, Catalogue>;
	/** 所有大分类对应的小分类 */
	const categorys: Record<string, Record<string, Category> | undefined | null> = {};

	/** 大分类key */
	let cataKey: string;
	/** 大分类 */
	let cata: Catalogue | undefined;
	/** 小分类Key */
	let cateKey: string;
	/** 小分类 */
	let cate: Category | undefined;
	/** 当前大分类下的所有小分类 */
	let allCate: Record<string, Category> | null;

	$: cataKey = $page.params.catalogue;
	$: cata = catalogue[cataKey];
	$: cateKey = ($page.url.hash || '').substring(1);
	$: if (browser && cata) updateCate(cateKey);

	/** 是否正在加载小分类 */
	let loadingCate = false;
	/** 更新小分类 */
	const updateCate = async (rawCate: string) => {
		loadingCate = true;
		let data = categorys[cataKey];
		if (data === undefined) {
			const resp = await listCategory(fetch, cataKey);
			if (resp) {
				const category: Record<string, Category> = (data = {});
				resp.forEach((cate) => (category[cate.key] = cate));
				data = categorys[cataKey] = category;
			} else data = categorys[cataKey] = null;
		}
		allCate = data;
		if (data === null) cate = undefined;
		else if (rawCate) cate = data[rawCate];
		else cate = Object.values(data)[0];
		loadingCate = false;
	};

	const flyData = { y: 20, duration: 800, easing: quintOut };
</script>

<svelte:window on:hashchange={() => (cateKey = (location.hash || '').substring(1))} />

{#await cata ? delay() : null then _}
	{#if cata && cate && allCate}
		<article class="container" in:fly={{ ...flyData, y: 100 }}>
			<h1 id="catalogue"><small>资源: </small>{cata.title}</h1>
			{#if loadingCate}
				<span aria-busy="true" />
			{:else}
				<div id="category" class="grid">
					{#each Object.keys(allCate) as key}
						<a href="?p=1#{key}">
							<div class="category" class:active={cate.key == key}>
								{allCate[key].title}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</article>

		<EssayList catalogue={cata} category={cate} />
	{:else if cata}
		<article class="container headings">
			<h1 class="error">啊哦, 找不到此子分类</h1>
			<h2>
				"{cata.title}" 中没有名为 "{cateKey}" 的资源子分类<br />请您检查您的地址是否有效,
				或者点击导航栏寻找任一有效的资源类别
			</h2>
		</article>
	{:else}
		<article class="container headings">
			<h1 class="error">啊哦, 找不到此分类</h1>
			<h2>
				在服务器上没有找到名为 "{cataKey}" 的资源类别<br />请您检查您的地址是否有效,
				或者点击导航栏寻找任一有效的资源类别
			</h2>
		</article>
	{/if}
{/await}

<style>
	#catalogue {
		border-bottom: 2px solid var(--primary);
		padding: 10px;
	}
	.category {
		text-align: center;
		margin: 10px;
		padding: 5px;
	}
	.category.active {
		border-bottom: 2px solid var(--primary);
	}
	article {
		padding: 20px;
	}
	.error {
		color: var(--bs-pink);
		margin: 10px;
	}
</style>
