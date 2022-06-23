<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MeLoginInfo } from '$defs/user';

	import { doLogout, loginUrl } from '$lib/api/user';

	export const hiddenExpand = true;

	/** 登出 */
	const logout = async () => {
		await doLogout(fetch);
		goto(loginUrl());
	};
	export let user: MeLoginInfo;
</script>

<p>登出您当前的账户: {user.name}</p>
<button on:click={logout}>登出</button>
