<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	//自适应屏幕宽度的容器, 带导航栏
	import { page } from '$app/stores';
	import type { Icons } from '$defs/iconfont';
	import { isNowMenu, type Menu, type Menus } from '$defs/Menu';
	import Icon from './Icon.svelte';

	/**返回菜单*/
	export let backMenu: Menu | undefined = undefined;
	/** 菜单 */
	export let menu: Menus;
	/** 集合时使用的菜单(忽略link) */
	export let collectIcon: Icons | undefined = 'liebiao';
	/** 当前菜单 */
	export let nowMenu: number = -1;
	$: active = menu.map((v) => isNowMenu($page.url, v));
	$: nowMenu = active.findIndex((v) => v);

	/** 导航栏样式 */
	export let navStyle: string | undefined = '';
	/** 主题内容样式 */
	export let mainStyle: string | undefined = '';

	/** 是否将菜单集合为一个元素 */
	export let collect: boolean = false;
	/** 如果不集合, 菜单真实长度 */
	let realWidth: number;
	/** 刷新集合状态 */
	const update = (_x?: any) => {
		_x;
		collect = window.innerWidth <= 1020 && realWidth > window.innerWidth;
	};
	$: if (browser) update(realWidth); //浏览器端更新
	/** 当前选中的元素*/
	let collectSel: number = nowMenu;
</script>

<svelte:window on:resize={update} />
<span style="position:fixed;width:0;"
	><span
		class="len nav-table"
		style="opacity:0;z-index:-1;height:0;visibility:hidden;"
		bind:offsetWidth={realWidth}
	>
		{#if backMenu}
			<span class="nav-cell"
				><slot name="nav-back" menu={backMenu}
					><a href={backMenu.link}><Icon icon={backMenu.icon} />&nbsp;{backMenu.name}</a></slot
				></span
			>
		{/if}
		{#each menu as m, i}
			<span class="nav-cell"
				><slot name="nav" menu={m} active={active[i]} index={i}
					><a class:active={active[i]} href={m.link}><Icon icon={m.icon} />&nbsp;{m.name}</a></slot
				></span
			>
		{/each}
	</span></span
>
<span class="body-table">
	<span class="body-cell nav">
		<span class="nav-table" style={navStyle}>
			{#if backMenu}
				<span class="nav-cell"
					><slot name="nav-back" menu={backMenu}
						><a href={backMenu.link}><Icon icon={backMenu.icon} />&nbsp;{backMenu.name}</a></slot
					></span
				>
			{/if}
			{#if collect}
				<span class="nav-cell"
					><slot name="nav-collect"
						><Icon icon={collectIcon} /><select
							bind:value={collectSel}
							on:change={() => goto(menu[collectSel].link)}
						>
							{#each menu as m, i}
								<option selected={nowMenu == i} value={i}>{m.name}</option>
							{/each}
						</select></slot
					></span
				>
			{:else}
				{#each menu as m, i}
					<span class="nav-cell"
						><slot name="nav" menu={m} active={active[i]} index={i}
							><a class:active={active[i]} href={m.link}><Icon icon={m.icon} />&nbsp;{m.name}</a
							></slot
						></span
					>
				{/each}
			{/if}
		</span>
	</span><span class="body-cell main" style={mainStyle}><slot /></span>
</span>

<style>
	.body-table {
		display: table;
		height: 100%;
		width: 100%;
	}
	.body-cell {
		vertical-align: top;
		display: table-cell;
		height: 100%;
	}
	.nav {
		width: 220px;
	}
	.nav-table {
		background-image: linear-gradient(to right, rgb(30, 58, 138), rgb(29, 78, 216));
		display: block;
		width: 100%;
		height: 100%;
		white-space: nowrap;
	}
	.nav-cell {
		display: block;
		width: 100%;
		text-align: center;
		min-height: 50px;
		line-height: 50px;
		padding: 8px 20px;
	}
	.nav-cell > * {
		display: inline-block;
		color: #fff;
		font-size: 1.2rem;
		font-weight: bolder;
		height: 100%;
	}
	.nav-cell > .active {
		border-bottom: 1px solid #fff;
	}
	.nav-cell > :global(svg) {
		color: #fff;
	}
	.main {
		padding: 20px;
	}
	@media (max-width: 1020px) {
		.body-table {
			display: block;
			height: unset;
			width: 100%;
		}
		.body-cell {
			display: block;
			width: 100%;
			height: unset;
			font-size: 1rem;
		}
		.nav-table {
			background-color: coral;
			display: table;
			width: 100%;
			height: 100%;
			border-radius: 0 0 10px 10px;
		}
		.nav-cell {
			display: table-cell;
			width: unset;
		}
	}

	select {
		background-color: unset;
		border: unset;
		text-align: center;
	}
	option {
		color: #000;
		background-color: #fff;
	}
</style>
