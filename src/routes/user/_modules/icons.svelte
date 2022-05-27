<script lang="ts">
	import Dialog from '$components/Dialog.svelte';
	import Icon from '$components/Icon.svelte';
	import { icons, infos, type Icons } from '$defs/iconfont';

	const iconInfo: { show?: boolean; id?: Icons } = {};
	const show = (id: Icons) => {
		iconInfo.show = true;
		iconInfo.id = id;
	};
</script>

<div class="all-icon">
	{#each icons as id (id)}
		<div class="icon-box" on:click={() => show(id)}>
			<div class="icon"><Icon icon={id} size={1.5} /></div>
			<div class="name">{infos[id]}</div>
			<div class="id">{id}</div>
		</div>
	{/each}

	<Dialog open={!!iconInfo.show}>
		<div class="dialog">
			<div class="icon"><Icon icon={iconInfo.id} size={5} /></div>
			<div class="name">{iconInfo.id && infos[iconInfo.id]}</div>
			<div class="id">{iconInfo.id}</div>
		</div>
	</Dialog>
</div>

<style>
	.icon-box {
		width: 160px;
		display: inline-block;
		background-color: #eee;
		margin: 10px;
		padding: 20px 10px;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		border-radius: 10px;
		cursor: pointer;
		position: relative;
	}

	@media only screen and (prefers-color-scheme: dark) {
		:global(*):not([data-theme='light']) .icon-box {
			background-color: var(--background-color);
		}
	}
	:global([data-theme='dark']) .icon-box {
		background-color: var(--background-color);
	}
	.icon-box .name {
		margin-top: 20px;
	}
	.dialog {
		width: 300px;
		text-align: center;
	}
	.dialog * {
		margin: 15px;
	}
</style>
