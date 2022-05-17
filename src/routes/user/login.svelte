<script context="module" lang="ts">
	import { getMe } from '$lib/api/user';
	import { browser } from '$app/env';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		if (!browser) return {};
		const user = await getMe(fetch);
		if (user.login) return { status: 302, redirect: './' };
		return {};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
</script>

<svelte:head><title>登录 - {$session.title}</title></svelte:head>
