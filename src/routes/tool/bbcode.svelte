<script lang="ts">
	import { bbcode, supportTags } from '$helpers/bbcode';

	let value: string;
</script>

<div class="container">
	<article>
		bbcode支持的标签:
		{#each supportTags as tag, i}
			{#if i},{/if}
			<span style:color="#000" data-tooltip={tag}>{tag}</span>
		{/each}
	</article>
</div>

<div class="main row">
	<div class="col-6">
		<textarea bind:value />
	</div>
	<div class="col-6">
		{@html value ? bbcode(value) : ''}
	</div>
	<div class="col-6">
		{value ? bbcode(value) : ''}
	</div>
	<div class="col-6"><pre>{JSON.stringify(value)}</pre></div>
</div>

<style>
	textarea {
		resize: vertical;
		min-height: 200px;
	}
	.main {
		width: 100vw;
		overflow-x: hidden;
	}
	pre {
		white-space: pre-wrap;
	}
</style>
