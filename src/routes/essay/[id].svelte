<script context="module" lang="ts">
	import { contentUrl, fileUrl, getEssay, getRandomEssay, listFile } from '$lib/api/content';
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
	import Dialog from '$components/Dialog.svelte';
	import { bbcode } from '$helpers/bbcode';

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

	/** 资源的内部状态 */
	let stat: Record<string, { sha1: boolean }> = {};
	const setInfo = (info: FileList): 1 => {
		info.files.forEach((f) => (stat[f.id] = { sha1: false }));
		return 1;
	};
</script>

<svelte:head><title>{essay.title} - {$session.title}</title></svelte:head>

<div class="container-xl">
	<article id="head">
		<nav>
			<ul>
				<li>
					<div class="headings">
						<h1 class="hidden-sm">{essay.title}</h1>
						<h3 class="visible-sm">{essay.title}</h3>
						<h2>
							<a href={contentUrl(essay.catalogue)}>{essay.catalogue}</a> &gt;
							<a href={contentUrl(essay.catalogue, essay.category)}>{essay.category}</a>
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
					<li>({essay.starAmount} 次评价)</li>
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
		{#if essay.imgs}
			<Swiper
				modules={[Pagination, Autoplay, Mousewheel]}
				spaceBetween={50}
				slidesPerView={1}
				pagination={{ clickable: true }}
				autoplay={true}
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
				{#if !info || typeof info === 'string'}
					无法获取资源: <span>{info}</span>
				{:else if setInfo(info)}
					<table role="grid" id="res_list">
						<thead>
							<tr>
								<th>文件名</th>
								<th>大小</th>
								<th>校验</th>
								<th>下载</th>
							</tr>
						</thead>
						<tbody>
							{#each info.files as file}
								<tr>
									<td class="txt">{file.name}</td>
									<td class="txt">{file.size}</td>
									<td
										class="icon"
										on:click={() => {
											stat[file.id] = { ...stat[file.id], sha1: true };
										}}
									>
										<span data-tooltip="点击显示文件的SHA1值">
											<Icon icon="xiaoyan" size={1.8} />
										</span>
									</td>
									<td class="icon">
										<a href={fileUrl(essay.id, file.id)} target="_blank">
											<span data-tooltip="点击下载此文件">
												<Icon icon="24px" size={1.8} />
											</span>
										</a>
									</td>
								</tr>
								<Dialog bind:open={stat[file.id].sha1}>
									<h1>文件校验</h1>
									<table>
										<tr><td>内容ID</td><td>{essay.id}</td></tr>
										<tr><td>文件ID</td><td>{file.id}</td></tr>
										<tr><td>文件名称</td><td>{file.name}</td></tr>
										<tr><td>文件SHA1</td><td>{file.sha1}</td></tr>
									</table>
								</Dialog>
							{/each}
						</tbody>
						<tfoot>
							<tr>
								<td>共计 {info.files.length} 个文件</td>
							</tr>
						</tfoot>
					</table>
				{/if}
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
	article {
		position: relative;
	}
	.res-btn {
		width: unset;
	}
	.visible-sm {
		display: none;
	}
	#res_list .icon {
		width: 10%;
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
