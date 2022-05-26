<script context="module" lang="ts">
	import { getMe, loginUrl } from '$lib/api/user';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		if (!browser) return {};
		const user = await getMe(fetch);
		if (!user || !user.login) return { status: 302, redirect: loginUrl() };
		return { props: { user } };
	};
</script>

<script lang="ts">
	import type { MeLoginInfo } from '$defs/user';
	import { browser } from '$app/env';
	import { session } from '$app/stores';
	import { blur } from 'svelte/transition';
	import Icon from '$components/Icon.svelte';

	const modules = browser && import.meta.glob('./_modules/*.svelte');

	export let user: MeLoginInfo;

	type Menus = keyof typeof menus;
	/** 菜单名称 */
	const menus = {
		basic: '用户信息',
		...(user && user.admin
			? {
					catalogue: '大分类',
					category: '小分类',
					'essay-upload': '新建内容',
					admin: '监控面板',
					icons: '图标列表',
					vaptcha: '验证码',
			  }
			: undefined),
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

	/** 页面锚点 */
	let menu: Menus = getMenu();
	$: nowModule = `./_modules/${menu}.svelte`;
	$: menuIndex = menusKey.indexOf(menu);

	let isExpand = false;
	/** 切换展开状态 */
	const expand = () => {
		isExpand = !isExpand;
	};
</script>

<svelte:window on:hashchange={() => (menu = getMenu())} />
<svelte:head><title>设置 - {$session.title}</title></svelte:head>

{#if browser && !user}
	<h3>内部出错</h3>
{:else if browser}
	<div class="container">
		<div class="row">
			{#if !isExpand}
				<div id="menu" class="col-lg-3 hidden-lg">
					<article>
						<h4>设置</h4>
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
			{/if}
			<div id="main" class="col-12" class:col-lg-9={!isExpand}>
				<a href="#{menusKey[menuIndex - 1]}" class="nav visible-lg" class:show-nav={menuIndex > 0}>
					<article>
						<span>上一个: {menus[menusKey[menuIndex - 1]] || ''}</span>
					</article>
				</a>
				<article id={menu}>
					<nav>
						<ul>
							<li><h3>{menus[menu]}</h3></li>
						</ul>
						<ul class="hidden-lg-inline">
							<li style:vertical-align="top" style:cursor="pointer" on:click={expand}>
								<Icon icon="expand" />
							</li>
						</ul>
					</nav>
					{#if browser && nowModule && modules && modules[nowModule]}
						{#await modules[nowModule]() then m}
							<span in:blur>
								<svelte:component this={m.default} {user} bind:isExpand />
							</span>
						{/await}
					{/if}
				</article>
				<a
					href="#{menusKey[menuIndex + 1]}"
					class="nav visible-lg"
					class:show-nav={menuIndex < menusKey.length - 1}
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
		overflow-y: hidden;
		transform: scaleY(0);
		transform-origin: 50% 0;
		transition: transform 0.3s;
	}
	#main > a.nav.show-nav {
		transform: scaleY(1);
	}
	#main > a.nav article span {
		display: inline-block;
		overflow: hidden;
		max-width: 100%;
	}

	.hidden-lg-inline {
		display: none;
	}
	.hidden-lg {
		display: none;
	}
	.visible-lg {
		display: block;
	}
	@media (min-width: 992px) {
		.hidden-lg-inline {
			display: inline;
		}
		.hidden-lg {
			display: block;
		}
		.visible-lg {
			display: none;
		}
	}
</style>
