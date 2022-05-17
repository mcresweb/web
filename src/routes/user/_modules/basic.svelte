<script lang="ts">
	import type { MeLoginInfo } from '$defs/user';

	export let user: MeLoginInfo;
	const info: Record<keyof MeLoginInfo, string | undefined> = {
		login: undefined,
		id: undefined,
		name: '用户名',
		email: '邮箱',
		admin: '管理员',
		vip: '会员',
		lock: '锁定账户',
	};
	const keys = <T extends string>(data: Record<T, any>): T[] => Object.keys(data) as T[];
</script>

<table class="table table-striped">
	<tbody>
		{#each keys(info) as key (key)}
			{#if info[key]}
				<!-- svelte-ignore a11y-misplaced-scope -->
				<tr><td>{info[key]}</td><td>{user[key]}</td></tr>
			{/if}
		{/each}
	</tbody>
</table>
