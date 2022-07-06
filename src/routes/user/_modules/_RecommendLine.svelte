<script lang="ts">
	import Dialog from '$components/Dialog.svelte';
	import Icon from '$components/Icon.svelte';

	import Star from '$components/Star.svelte';
	import Thumbnail from '$components/Thumbnail.svelte';
	import {
		EssayRecommendInfo,
		EssayRecommendInfoKey,
		type EssayRecommendList,
	} from '$defs/content';
	import { essayRecommendUrl } from '$lib/api/content';
	import { imgUrl } from '$lib/api/img';

	export let info: EssayRecommendList['list'][number];

	let open = false;
</script>

<div class="box" on:click={() => (open = true)}>
	<span class="img"><Thumbnail src={imgUrl(info.img)} /></span>
	<span class="txt">
		<span class="title">{info.title}</span>
		<br />
		<span class="info">
			{#if info.star}
				<span><Star star={info.star} small /></span>
			{/if}
			<span>
				<Icon icon="xiazai" />
				{info.download}
			</span>
			<span>
				{info.sender}
			</span>
		</span>
	</span>
</div>
<Dialog bind:open>
	<h1>推荐信息</h1>
	<table>
		<tbody>
			<tr><td>内容ID</td><td>{info.id}</td></tr>
			<tr><td>内容标题</td><td>{info.title}</td></tr>
			<tr><td>内容发布者</td><td>{info.sender}</td></tr>
			{#each EssayRecommendInfoKey as key}
				{@const x = EssayRecommendInfo[key]}
				<tr>
					<td>{x?.name}</td>
					<td>{x?.t ? x.t(info[key]) : info[key]}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<a href={essayRecommendUrl(info.id)} role="button">编辑</a>
</Dialog>

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
