<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ error, status }) => {
		return { props: { error, status } };
	};
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import { browser, dev } from '$app/env';

	export let error: Error;
	export let status: number;
</script>

<div class="container">
	<article>
		{#if browser}
			<div class="headings">
				<h1>啊哦, 出错了: {status}</h1>
				<h2>{$page.url.href}</h2>
			</div>
		{:else}
			<h1>啊哦, 出错了: {status}</h1>
		{/if}
		<p><b>{error.message}</b></p>
		<p><small>当前时间：{new Date().toLocaleString()}</small></p>
		{#if dev}
			<hr />
			栈信息:
			<pre>{error.stack}</pre>
			<small>栈信息仅开发模式可见</small>
		{/if}
	</article>
</div>

<style>
	h1 {
		color: var(--bs-red);
	}
</style>
