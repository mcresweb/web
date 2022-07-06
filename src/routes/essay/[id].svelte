<script context="module" lang="ts">
	import {
		contentUrl,
		getCatalogueByKey,
		getCategoryByKey,
		getEssay,
		getRandomEssay,
		listFile,
		recommendEssay,
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
	import {
		EssayRecommendInfo,
		EssayRecommendInfoKey,
		type Essay,
		type EssayList,
		type FileList,
	} from '$defs/content';
	import { Autoplay, Pagination, Mousewheel } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/autoplay';
	import { imgUrl } from '$lib/api/img';
	import { marked } from 'marked';
	import { getInfo, getMe } from '$lib/api/user';
	import { browser, dev } from '$app/env';
	import { page, session } from '$app/stores';
	import Icon from '$components/Icon.svelte';
	import { bbcode } from '$helpers/bbcode';
	import { delay } from '$helpers/delay';
	import FileTable from '$components/FileTable.svelte';
	import EssayLine from './_EssayLine.svelte';
	import Dialog from '$components/Dialog.svelte';
	import { recommendEssayInfo } from '$lib/api/content';
	import EssayRecommendDialog from './_EssayRecommendDialog.svelte';

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

	let showRight: boolean = true;
	/**右侧推荐列表*/
	let recommend: EssayList['list'] | null = null;
	$: if (browser && typeof essay.id === 'number')
		recommendEssay(fetch, essay.id).then((x) => (recommend = x));

	let showRecommend = false;
</script>

<svelte:head><title>{essay.title} - {$session.title}</title></svelte:head>

<div class="row main">
	<div class="col-12" class:col-md-9={showRight && !!recommend}>
		<article id="head">
			{#if browser}
				<span class="topbar">
					{#await getMe(fetch) then info}
						{#if info.login && info.admin}
							<span
								data-tooltip="点击编辑推荐信息"
								on:click={() => (showRecommend = !showRecommend)}
							>
								<!-- TODO iconfont损坏 -->
								<Icon icon="24px" size={1.3} />
							</span>
							<EssayRecommendDialog bind:open={showRecommend} id={essay.id} />
							<a data-tooltip="点击编辑此essay" href={`./edit/${essay.id}`}>
								<!-- TODO iconfont损坏 -->
								<Icon icon="24px" size={1.3} />
							</a>
						{/if}
					{/await}
				</span>
			{/if}
			<nav class="title-nav">
				<ul>
					<li>
						<div class="headings">
							<h1 class="hidden-sm title">{essay.title}</h1>
							<h3 class="visible-sm title">{essay.title}</h3>
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
				<ul class="hidden-sm res-field">
					<li><button class="res-btn" on:click={openRes}>获取资源</button></li>
				</ul>
			</nav>
			<div class="sm-res-box visible-sm">
				<button class="res-btn">&nbsp;</button>
				<button class="res-btn" on:click={openRes}>获取资源</button>
			</div>
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
	{#if showRight && recommend}
		<div class="col-12 col-md-3">
			<article id="recommend">
				<h3>推荐内容</h3>
				<div class="row">
					{#each recommend as ess (ess.id)}
						<div class="col-6 col-md-12">
							<EssayLine {...ess} />
						</div>
					{/each}
				</div>
			</article>
		</div>
	{/if}
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
	.main {
		padding: 0 20px;
	}
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
	#head .title-nav li {
		padding-bottom: 0;
	}
	#head .title-nav ul:first-child {
		width: 90%;
		overflow-x: hidden;
	}
	#head .title-nav ul:first-child > li,
	#head .title-nav ul:first-child > li > div {
		width: 100%;
	}
	#head .title-nav .title {
		white-space: normal;
	}
	#head .topbar {
		position: absolute;
		right: 10px;
		top: 20px;
	}
	#head .topbar > * {
		margin-right: 10px;
		cursor: pointer;
		border-bottom: none;
	}
	article {
		position: relative;
	}
	.sm-res-box {
		display: block;
		position: relative;
		width: 100%;
	}
	.sm-res-box > button:first-child {
		display: inline-block;
		width: 0;
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		border: none;
		opacity: 0;
		cursor: normal;
	}
	.sm-res-box > button:last-child {
		display: inline-block;
		position: absolute;
		right: 0;
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
		.sm-res-box {
			display: block;
		}

		#head .title-nav ul:first-child {
			width: 100%;
		}
		.hidden-sm {
			display: none;
		}
	}
	#recommend {
		padding-left: 5px;
		padding-right: 5px;
	}
</style>
