<script lang="ts">
	import { page } from '$app/stores';

	import AdaptContainer from '$components/AdaptContainer.svelte';
	import { DefaultType, getNowMenu, type Menu, type Menus } from '$defs/Menu';

	const menu: Menus = [
		{ name: '主页', link: '/home', matchExtra: DefaultType('t'), icon: 'htmal5icon06' },
		{ name: '资源', link: '/resources', icon: 'ziyuan' },
		{ name: '用户', link: '/user', icon: 'yonghu' },
	];
	let nowMenu: number = getNowMenu($page.url, menu);
</script>

<AdaptContainer {menu} bind:nowMenu>123</AdaptContainer>
