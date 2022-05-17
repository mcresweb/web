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
		logout: '登出',
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
	import { scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Catalogue from '../content/[catalogue].svelte';
	import { blur } from 'svelte/transition';

	const modules = browser && import.meta.glob('./_modules/*.svelte');

	export let user: MeLoginInfo;

	/** 页面锚点 */
	let menu: Menus = getMenu();
	$: nowModule = `./_modules/${menu}.svelte`;
	$: menuIndex = menusKey.indexOf(menu);

	const defH = 200;
	let mainNavHeight: number = -1;
	let mnh = 0;
	$: mnh = Math.max(mnh >= defH ? 0 : mnh, mainNavHeight > 0 ? mainNavHeight : defH);
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
								{#each menusKey as m (m)}
									<li><a class:active={m === menu} href="#{m}">{menus[m]}</a></li>
								{/each}
							</ul>
						</nav>
					</aside>
				</article>
			</div>
			<div id="main" class="col-lg-9 col-12">
				<a
					href="#{menusKey[menuIndex - 1]}"
					class="nav visible-lg"
					bind:offsetHeight={mainNavHeight}
					style:max-height={menuIndex > 0 ? `${mnh + 1}px` : 0}
					style:opacity={menuIndex > 0 ? 1 : 0}
				>
					<article>
						<span>上一个: {menus[menusKey[menuIndex - 1]] || ''}</span>
					</article>
				</a>
				<article id={menu}>
					<h3>{menus[menu]}</h3>
					{#if browser && nowModule && modules && modules[nowModule]}
						{#await modules[nowModule]() then m}
							<span in:blur>
								<svelte:component this={m.default} {user} />
							</span>
						{/await}
					{/if}
				</article>
				<a
					href="#{menusKey[menuIndex + 1]}"
					class="nav visible-lg"
					bind:offsetHeight={mainNavHeight}
					style:max-height={menuIndex < menusKey.length - 1 ? `${mnh + 1}px` : 0}
					style:opacity={menuIndex < menusKey.length - 1 ? 1 : 0}
				>
					<article>
						<span>下一个: {menus[menusKey[menuIndex + 1]] || ''}</span>
					</article>
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	#menu a {
		transition: margin-left 0.2s;
		width: 100%;
		margin: 2px 0;
	}
	#menu a.active {
		color: var(--primary-inverse);
		background-color: var(--primary);
	}
	#menu a:hover {
		color: var(--primary-inverse);
		background-color: var(--primary-hover);
		margin-left: 10px;
	}

	#main > a.nav {
		white-space: nowrap;
		padding: 0;
		background-color: rgba(0, 0, 0, 0);
		transition: max-height 0.5s;
		overflow-y: hidden;
	}
	#main > a.nav article span {
		display: inline-block;
		overflow: hidden;
		max-width: 100%;
	}

	.hidden-lg {
		display: none;
	}
	.visible-lg {
		display: block;
	}
	@media (min-width: 992px) {
		.hidden-lg {
			display: block;
		}
		.visible-lg {
			display: none;
		}
	}
</style>
