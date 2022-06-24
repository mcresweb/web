<script lang="ts">
	import EssayEdit from '$components/EssayEdit.svelte';
	import { uploadEssay } from '$lib/api/content';

	export let isExpand: boolean = true;
	const expand = () => (isExpand = true);
</script>

<div on:click={expand}>
	<EssayEdit saveKey="aaa" uploadEssay={(data) => uploadEssay(fetch, data)} />
</div>
