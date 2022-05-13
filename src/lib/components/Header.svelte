<script lang="ts">
	import { session } from '$app/stores';
	import { listCatalogue } from '$lib/api/content';

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
					<li><a href="#{catalogue.key}">{catalogue.title}</a></li>
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
		box-shadow: 0 0 5px #999;
		padding: 0 10px;
	}
</style>
