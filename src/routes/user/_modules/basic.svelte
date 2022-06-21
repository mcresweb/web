<script lang="ts">
	import type { MeLoginInfo } from '$defs/user';

	export const hiddenExpand = true;

	export let user: MeLoginInfo;
	const info: Record<keyof MeLoginInfo, string | undefined> = {
		login: undefined,
		id: undefined,
		name: '用户名',
		email: '邮箱',
		admin: '管理员',
		vip: undefined,
		vipName: '会员',
		lock: '锁定账户',
	};
	const falseHidden: (keyof MeLoginInfo)[] = ['admin', 'lock'];
	const keys = <T extends string>(data: Record<T, any>): T[] => Object.keys(data) as T[];
</script>

<table class="table table-striped">
	<tbody>
		{#each keys(info) as key (key)}
			{#if info[key] && (!falseHidden.includes(key) || user[key] !== false)}
				<tr>
					<td>{info[key]}</td>
					<td>{user[key]}</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
