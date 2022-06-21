<script lang="ts">
	import { browser } from '$app/env';
	import Dialog from '$components/Dialog.svelte';
	import type { UseResp } from '$defs/keyword';

	import type { MeLoginInfo } from '$defs/user';
	import { getPlatform } from '$lib/api/config';
	import { tokenLen, useToken } from '$lib/api/keyword';
	import { getMyVip } from '$lib/api/user';

	export let user: MeLoginInfo;

	let tokenLength = -1;
	if (browser) tokenLen(fetch).then((len) => (tokenLength = len));

	/**用户输入的会员码*/
	let token: string;
	$: badToken = !token || !/^[0-9a-z]+$/i.test(token) || token.length != tokenLength;
	/**使用响应*/
	let useResp: UseResp | undefined = undefined;
	/**使用响应面板的打开状态*/
	let openUseResp: boolean = false;
	/**使用会员码*/
	const useKeyword = async () => {
		useResp = await useToken(fetch, token);
		openUseResp = true;
	};
</script>

<p>您可以在此兑换您获得的会员码</p>

{#if browser}
	{#await getMyVip(fetch) then vipInfo}
		{@const hasVip =
			typeof ((!!useResp?.success && useResp.expire) || vipInfo?.expire) === 'number' &&
			(vipInfo?.expire || Number.MAX_SAFE_INTEGER) > Date.now()}
		<div class="headings">
			{#if hasVip}
				<h2>尊贵的 {vipInfo?.vipName || '?'} 您好!</h2>
			{:else}
				<h4>您的VIP状态: {vipInfo?.vipName || '未知'}</h4>
			{/if}

			{#if hasVip}
				<h5>
					过期时间: {new Date(
						(!!useResp?.success && useResp.expire) || vipInfo?.expire || 0,
					).toLocaleString()}
				</h5>
			{:else if user?.admin}
				<h5>尊贵的管理员您好!</h5>
			{:else}
				<h5>^_^</h5>
			{/if}
		</div>
	{/await}
{/if}

<hr />

<label for="kw-use">
	使用会员码
	<div class="row">
		<div class="col-12 col-md-9">
			<input
				id="kw-use"
				type="text"
				placeholder="在此键入您获得的会员码"
				bind:value={token}
				aria-invalid={token ? badToken : undefined}
			/>
		</div>
		<div class="col-12 col-md-3">
			<button disabled={badToken} on:click={useKeyword}>使用</button>
		</div>
	</div>
</label>
<Dialog bind:open={openUseResp}>
	{#if useResp}
		{#if useResp.success}
			<h1 style:color="var(--bs-teal)">使用成功!</h1>
			<p>您新的VIP到期时间: {new Date(useResp.expire).toLocaleString()}</p>
		{:else}
			<h1 style:color="var(--bs-red)">啊哦, 失败了</h1>
			<p>发生了错误: {useResp.err}</p>
		{/if}
	{:else}
		<h1>错误</h1>
	{/if}
	<footer>
		<div class="row">
			<div class="col-6 col-md-8">&nbsp;</div>
			<div class="col-6 col-md-4"><button on:click={() => (openUseResp = false)}>确定</button></div>
		</div>
	</footer>
</Dialog>

<hr />
{#await getPlatform(fetch) then platform}
	{#if platform && platform.length > 0}
		<h6>如何获取会员码</h6>
		<div class="row">
			{#each platform as p}
				<a class="platform col-6 col-md-4" href={p.url} target="_blank">
					<span class="name">{p.name}</span>
					<img src={p.img} alt="" />
					<span class="info">{@html p.info}</span>
				</a>
			{/each}
		</div>
	{/if}
{/await}

<style>
	.platform {
		border-radius: 10px;
		display: block;
		border: var(--border-width) solid var(--form-element-border-color);
	}
	.platform > .name {
		padding: 5px;
		--color: var(--h1-color);
		font-weight: 700;
		font-size: 1.2em;
		display: inline-block;
		width: 100%;
		text-align: center;
	}
	.platform > .info {
		display: inline-block;
		padding: 10px 0;
	}
</style>
