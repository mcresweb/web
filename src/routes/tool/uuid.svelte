<script lang="ts">
	import { browser } from '$app/env';

	import { v4 } from '@lukeed/uuid';

	let amount: number = 10;
	let useG: any = true;
	let uuid: string;
	const summon = () => (uuid = Array(amount).fill(0).map(v4).join('\n'));
	$: if (browser && amount) summon();
</script>

<div class="container">
	<article>
		<h1>生成UUID</h1>
		<fieldset>
			<label for="range"
				>生成数量: {amount}
				<input type="range" min="1" max="100" bind:value={amount} id="range" name="range" />
			</label>
			<label for="switch">
				<input type="checkbox" id="switch" name="switch" role="switch" bind:checked={useG} />
				添加 <b>"-"</b> 连接符
			</label>
		</fieldset>
		<button on:click={summon}>生成</button>
	</article>
	{#if uuid}
		<article>
			<pre>{useG ? uuid : uuid.replace(/-/g, '')}</pre>
		</article>
	{/if}
</div>
