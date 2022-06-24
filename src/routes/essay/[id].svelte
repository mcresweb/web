<script context="module" lang="ts">
	import {
		contentUrl,
		getCatalogueByKey,
		getCategoryByKey,
		getEssay,
		getRandomEssay,
		listFile,
	} from '$lib/api/content';
	import type { Load } from '@sveltejs/kit';

	const random = 'random';

	export const load: Load = async ({ fetch, params }) => {
		let essay: Essay | null;
		if (params.id === random) {
			essay = await getRandomEssay(fetch);
			if (!essay) return { status: 404, error: '还没有内容可以显示' };
		} else {
			essay = await getEssay(fetch, parseInt(params.id));
			if (!essay) return { status: 404, error: `找不到ID为 ${params.id} 的内容` };
		}
		return {
			props: { essay },
		};
	};
</script>

<script lang="ts">
	import Star from '$components/Star.svelte';
	import type { Essay, FileList } from '$defs/content';
	import { Autoplay, Pagination, Mousewheel } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/autoplay';
	import { imgUrl } from '$lib/api/img';
	import { marked } from 'marked';
	import { getInfo } from '$lib/api/user';
	import { browser, dev } from '$app/env';
	import { page, session } from '$app/stores';
	import Icon from '$components/Icon.svelte';
	import { bbcode } from '$helpers/bbcode';
	import { delay } from '$helpers/delay';
	import { goto } from '$app/navigation';
	import FileTable from '$components/FileTable.svelte';

	export let essay: Essay;
	if (browser && $page.params.id == random) history.replaceState(null, '', './' + essay.id);

	/** 是否显示资源 */
	let showRes: boolean = browser && $page.url.hash === '#res';
	/** 显示资源 */
	const openRes = () => {
		showRes = true;
		setTimeout(() => (location.hash = 'res'), 1);
	};
	/** 资源promise */
	let resPromise: Promise<FileList | string>;
</script>

<svelte:head><title>{essay.title} - {$session.title}</title></svelte:head>

<div class="container-xl">
	<article id="head">
		<span class="edit-btn" on:click={() => goto(`./edit/${essay.id}`)}>
			<Icon icon="24px" size={1.3} />
		</span>
		<nav>
			<ul>
				<li>
					<div class="headings">
						<h1 class="title hidden-sm">{essay.title}</h1>
						<h3 class="title visible-sm">{essay.title}</h3>
						<h2>
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
						</h2>
					</div>
				</li>
			</ul>
			<ul>
				<li><button class="res-btn" on:click={openRes}>获取资源</button></li>
			</ul>
		</nav>
		<nav>
			<ul>
				<li>评价:</li>
				{#if essay.star !== undefined}
					<li class="visible-sm">
						<Star star={essay.star} small />
					</li>
					<li class="hidden-sm">
						<Star star={essay.star} />
					</li>
				{:else}
					<li>暂无</li>
				{/if}
				{#if essay.starAmount !== undefined}
					<li class="hidden-sm">({essay.starAmount} 次评价)</li>
				{/if}
			</ul>
			<ul>
				<li>下载量:</li>
				<li>{essay.download}</li>
			</ul>
			<ul>
				<li>发布者:</li>
				{#await browser && essay.sender && getInfo(fetch, essay.sender)}
					<li>{essay.sender || ''}</li>
				{:then user}
					<li>{(user && user.name) || essay.sender || ''}</li>
				{/await}
			</ul>
		</nav>
		{#if essay.tags}
			<hr />
			<span id="tags">
				标签:
				{#each essay.tags as tag, i}
					{#if i},{/if}&nbsp;<a href="/tag/{tag}">{tag}</a>&nbsp;
				{/each}
			</span>
		{/if}
		{#if essay.description}
			<hr />
			<p>{essay.description}</p>
		{/if}
		<hr />
		{#if essay.imgs && essay.imgs.length > 0}
			<Swiper
				modules={[Pagination, Autoplay, Mousewheel]}
				spaceBetween={50}
				slidesPerView={1}
				pagination={{ clickable: true }}
				autoplay={essay.imgs.length > 1}
				loop={true}
			>
				{#each essay.imgs as uuid}
					<SwiperSlide><img alt="" src={imgUrl(uuid)} /></SwiperSlide>
				{/each}
			</Swiper>
		{/if}
	</article>
	{#if showRes || resPromise}
		<article id="res" style:display={showRes ? '' : 'none'}>
			<nav>
				<ul>
					<h2>资源</h2>
				</ul>
				<ul>
					<button on:click={() => (showRes = false)}>收起</button>
				</ul>
			</nav>
			{#await (resPromise = resPromise || listFile(fetch, essay.id))}
				<span aria-busy="true" />
			{:then info}
				<FileTable id={essay.id} files={info} />
			{/await}
		</article>
	{/if}
	<article>
		{#if essay.type === 'markdown'}
			{@html marked(essay.content)}
		{:else if essay.type === 'bbcode'}
			{@html bbcode(essay.content)}
		{:else if essay.type === 'html'}
			{@html essay.content}
		{:else if essay.type === 'text'}
			{essay.content}
		{:else}
			<h3 style:color="var(--bs-danger)">错误: 未知的正文类型</h3>
			<p>
				我们收到了一个不支持的正文类型: {essay.type}
				<br />
				请您联系网站管理员来解决这个问题
			</p>
		{/if}
	</article>
</div>

{#if dev}
	<div class="container">
		<article>
			<h1>调试数据</h1>
			<pre>{JSON.stringify(essay, null, 4)}</pre>
		</article>
	</div>
{/if}

<style>
	#tags {
		font-size: 0.8em;
		text-align: right;
		width: 100%;
		display: inline-block;
	}
	#tags a {
		margin: 2px;
	}
	#head button {
		white-space: nowrap;
	}
	#head h2,
	#head h2 * {
		color: var(--bs-gray) !important;
	}
	#head .title {
		max-width: 90%;
		white-space: normal;
	}
	#head .edit-btn {
		cursor: pointer;
		position: absolute;
		right: 20px;
		top: 20px;
	}
	article {
		position: relative;
	}
	.res-btn {
		width: unset;
	}
	.visible-sm {
		display: none;
	}
	@media (max-width: 768px) {
		.visible-sm {
			display: unset;
		}
		.hidden-sm {
			display: none;
		}
	}
</style>
