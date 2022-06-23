<script lang="ts">
	import { session } from '$app/stores';
	import { contentUrl, listCatalogue } from '$lib/api/content';
	import HeaderSearcher from './HeaderSearcher.svelte';

	import Icon from './Icon.svelte';

	let searchShow = false;
</script>

<header class:fixed={searchShow}>
	<nav>
		<ul>
			<li><a href="/"><strong>{$session.title}</strong></a></li>
		</ul>
		<ul>
			<li class="search-btn" on:click={() => (searchShow = !searchShow)}>
				<!-- TODO iconfont升级 替换为搜索图标 -->
				<Icon icon="24px" size={1.5} />
			</li>
			{#await listCatalogue(fetch) then list}
				{#each list as catalogue}
					<li><a href={contentUrl(catalogue.key)}>{catalogue.title}</a></li>
				{/each}
			{/await}
		</ul>
		<ul>
			<li><a href="/user"><Icon icon="yonghu" size={1.5} /></a></li>
		</ul>
	</nav>
	<HeaderSearcher bind:show={searchShow} />
</header>

<style>
	header.fixed {
		z-index: 9;
		position: fixed;
		width: 100%;
		left: 0;
	}
	header {
		height: var(--header-height);
		box-shadow: 0 0 5px #999;
		padding: 0 10px;
		background-color: var(--card-background-color);
		position: relative;
	}
	nav .search-btn {
		padding-right: 20px;
		cursor: pointer;
	}
</style>
