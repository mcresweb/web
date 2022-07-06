<script lang="ts">
	import Icon from '$components/Icon.svelte';

	import Star from '$components/Star.svelte';
	import Thumbnail from '$components/Thumbnail.svelte';
	import { essayUrl } from '$lib/api/content';
	import { imgUrl } from '$lib/api/img';

	export let id: number;
	export let sender: string;
	export let title: string;
	export let star: number | undefined = undefined;
	export let download: number;
	export let img: string;
</script>

<a class="box" href={essayUrl(id)}>
	<span class="img"><Thumbnail src={imgUrl(img)} /></span>
	<span class="txt">
		<span class="title">{title}</span>
		<br />
		<span class="info">
			{#if star}
				<span><Star {star} small /></span>
			{/if}
			<span>
				<Icon icon="xiazai" />
				{download}
			</span>
			<span>
				{sender}
			</span>
		</span>
	</span>
</a>

<style>
	.box {
		display: block;
		padding: 10px 0;
		--height: 80px;
		height: calc(var(--height) + 10px * 2);
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		cursor: pointer;
		background-color: var(--background-color);
		border-bottom: var(--border-width) solid var(--form-element-border-color);
	}
	.box:hover {
		background-color: var(--primary-focus);
		transition: background-color 0.2s;
	}
	.box > span {
		display: inline-block;
		vertical-align: top;
	}
	.img {
		width: var(--height);
		height: var(--height);
	}
	.txt {
		height: var(--height);
		width: calc(100% - var(--height));
		line-height: calc(var(--height) / 3.33);
		padding: 1px;
	}
	.title {
		display: inline-block;
		height: 66%;
		white-space: normal;
		overflow: hidden;
	}
	.info {
		display: inline-block;
		height: 33%;
		display: table;
		padding: 4px 0;
		width: 100%;
	}
	.info > * {
		display: table-cell;
		margin: 0 auto;
		text-align: left;
	}
</style>
