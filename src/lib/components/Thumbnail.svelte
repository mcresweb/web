<script lang="ts">
	import { browser } from '$app/env';
	import { inWindow } from '$helpers/window';

	export let src: string;

	export let show: boolean = false;
	let element: HTMLSpanElement | undefined = undefined;
	const lazyCheck = () => !show && element && inWindow(element) && (show = true);
	$: if (browser && element) lazyCheck();
</script>

<span class="img" style:background-image={show ? `url('${src}')` : undefined} bind:this={element} />
<svelte:window on:scroll={lazyCheck} />

<style>
	.img {
		display: inline-block;
		background-color: rgb(180, 177, 177);
		margin: 3px 1%;
		padding-bottom: 100%;
		width: 100%;
		height: 0px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}
</style>
