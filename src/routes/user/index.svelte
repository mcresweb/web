<script context="module" lang="ts">
	import { getMe, loginUrl } from '$lib/api/user';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		if (!browser) return {};
		const user = await getMe(fetch);
		if (!user.login) return { status: 302, redirect: loginUrl() };
		return { props: { user } };
	};

	type Menus = keyof typeof menus;
	/** 菜单名称 */
	const menus = {
		basic: '基础信息',
	};
	/** 菜单列表*/
	const menusKey = Object.keys(menus) as Menus[];
	const getMenu = (): Menus => {
		if (!browser || !window.location) return 'basic';
		const hash = location.hash.substring(1);
		if (menus[hash as Menus]) return hash as Menus;
		return 'basic';
	};
</script>

<script lang="ts">
	import type { MeLoginInfo } from '$defs/user';
	import { browser } from '$app/env';
	import { session } from '$app/stores';

	export let user: MeLoginInfo;

	/** 页面锚点 */
	let menu: Menus = getMenu();
</script>

<svelte:window on:hashchange={() => (menu = getMenu())} />
<svelte:head><title>用户 - {$session.title}</title></svelte:head>

{#if browser && !user}
	<h3>内部出错</h3>
{:else if browser}
	<div class="container">
		<div class="row">
			<div id="menu" class="col-lg-3 hidden-lg">
				<article>
					<h4>用户设置</h4>
					<aside>
						<nav>
							<ul>
								{#each menusKey as menu (menu)}
									<li><a href="#{menu}">{menus[menu]}</a></li>
								{/each}
							</ul>
						</nav>
					</aside>
				</article>
			</div>
			<div id="main" class="col-lg-9 col-12">
				<article>
					<h3>{menus[menu]}</h3>
				</article>
			</div>
		</div>
	</div>
{/if}

<style>
	.hidden-lg {
		display: none;
	}
	@media (min-width: 992px) {
		.hidden-lg {
			display: unset;
		}
	}
</style>
