<script lang="ts">
	import type { Icons } from '$defs/iconfont';
	import { IconPrefix } from '$defs/iconfont';

	let className = '';
	export { className as class };
	export let id: string | undefined = undefined;
	export let style: string | undefined = undefined;
	export let size = 1;
	/** 图标名称*/
	export let icon: Icons | undefined;
	$: href = `${IconPrefix}${icon}`;
</script>

{#if icon}
	<svg
		{id}
		style="font-size:{size}em;{style || ''}"
		class="icon {className}"
		aria-hidden="true"
		on:click
	>
		<use xlink:href={href} />
	</svg>
{/if}

<style>
	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
</style>
