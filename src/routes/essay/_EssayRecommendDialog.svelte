<script lang="ts">
	import Dialog from '$components/Dialog.svelte';
	import { EssayRecommendInfo, EssayRecommendInfoKey } from '$defs/content';
	import { essayRecommendUrl, recommendEssayInfo } from '$lib/api/content';

	export let id: number;
	export let open: boolean;
</script>

<Dialog bind:open>
	<h1>内容推荐</h1>
	{#if open}
		{#await recommendEssayInfo(fetch, id) then info}
			当前状态:
			{#if info && info.expire > Date.now()}
				<table>
					<tbody>
						{#each EssayRecommendInfoKey as key}
							{@const x = EssayRecommendInfo[key]}
							<tr>
								<td>{x?.name}</td>
								<td>{x?.t ? x.t(info[key]) : info[key]}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				暂未被推荐!
				<br />
				<br />
			{/if}
		{/await}
	{/if}
	<div class="grid">
		<button class="secondary" on:click={() => (open = false)}>取消</button>
		<a href={essayRecommendUrl(id)}><button>调整推荐</button></a>
	</div>
</Dialog>
