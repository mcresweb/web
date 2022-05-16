<script context="module" lang="ts">
	import { getEssay } from '$lib/api/content';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, params }) => {
		const essay = await getEssay(fetch, parseInt(params.id));
		if (!essay) return { status: 404 };
		return {
			props: { essay },
		};
	};
</script>

<script lang="ts">
	import Star from '$components/Star.svelte';
	import type { Essay } from '$defs/content';
	import { Autoplay, Pagination, Lazy, Mousewheel } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/autoplay';
	import { imgUrl } from '$lib/api/img';
	import { marked } from 'marked';

	export let essay: Essay;
</script>

<div class="container">
	<article id="head">
		<nav>
			<ul>
				<li>
					<div class="headings">
						<h1 class="hidden-sm">{essay.title}</h1>
						<h3 class="visible-sm">{essay.title}</h3>
						<h2>{essay.catalogue} &gt; {essay.category}</h2>
					</div>
				</li>
			</ul>
			<ul><li><button class="res-btn">获取资源</button></li></ul>
		</nav>
		<nav>
			<ul>
				<li>评价:</li>
				<li class="visible-sm">
					<Star star={essay.star} small />
				</li>
				<li class="hidden-sm">
					<Star star={essay.star} />
				</li>
			</ul>
			<ul>
				<li>下载量:</li>
				<li>{essay.download}</li>
			</ul>
			<ul>
				<li>发布者:</li>
				<li>123</li>
			</ul>
		</nav>
		<hr />
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
	</article>
	<article>
		{#if essay.type === 'markdown'}
			{@html marked(essay.content)}
		{:else if essay.type === 'bbcode'}
			bbcode
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

<style>
	#head button {
		white-space: nowrap;
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
