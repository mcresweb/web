<script lang="ts">
	import { session } from '$app/stores';
	import { contentUrl, listCatalogue } from '$lib/api/content';

	import Icon from './Icon.svelte';
</script>

<header>
	<nav>
		<ul>
			<li><a href="/"><strong>{$session.title}</strong></a></li>
		</ul>
		<ul>
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
</header>

<style>
	header {
		height: var(--header-height);
		box-shadow: 0 0 5px #999;
		padding: 0 10px;
		background-color: var(--card-background-color);
	}
</style>
