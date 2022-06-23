<script lang="ts">
	import { goto } from '$app/navigation';
	import type { SearchDoc } from '$defs/search';
	import { essayUrl } from '$lib/api/content';

	export let docs: SearchDoc[] | null;

	const flagStr = '<b>';
	const hf = (str: string) => str.indexOf(flagStr) >= 0;
</script>

{#if docs}
	<main class="essay_list container-fluid">
		<div class="row">
			{#each docs as data}
				{@const doc = data.doc}
				<div class="essay col-md-6 col-lg-4 col-xxl-3" on:click={() => goto(essayUrl(data.id))}>
					<article>
						<div class="title">{@html doc.title}</div>
						<div class="content">
							{#if hf(doc.description)}
								{@html doc.description}
							{:else if hf(doc.content)}
								{@html doc.content}
							{:else if typeof doc.tags === 'string' && hf(doc.tags)}
								标签: {@html doc.tags}
							{:else if Array.isArray(doc.tags) && doc.tags.some(hf)}
								标签: {@html doc.tags.filter(hf)}
							{:else}
								{doc.content}
							{/if}
						</div>
					</article>
				</div>
			{/each}
		</div>
	</main>
{/if}

<style>
	.essay_list {
		padding: 10px 8vw;
	}
	.essay {
		cursor: pointer;
	}
	.essay > article {
		padding: 20px;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.essay > article:hover {
		--card-box-shadow: 0 0.125rem 1rem rgba(27, 40, 50, 0.08),
			0 0.125rem 2rem rgba(27, 40, 50, 0.16), 0 0 0 0.0625rem rgba(27, 40, 50, 0.048);
		transform: translateY(-5px);
	}
	.essay .content {
		margin-top: 3px;
		padding-top: 3px;
		border-top: 1px #555 solid;
	}
	.essay > article :global(b) {
		background-color: var(--mark-background-color);
		color: var(--mark-color);
		font-weight: bold;
	}
</style>
