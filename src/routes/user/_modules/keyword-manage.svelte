<script lang="ts">
	import { dev } from '$app/env';
	import Datetime from '$components/Datetime.svelte';
	import DatetimeRange from '$components/DatetimeRange.svelte';
	import Dialog from '$components/Dialog.svelte';
	import Icon from '$components/Icon.svelte';

	import {
		SearchReq,
		TokenInfoKeys,
		TokenInfoName,
		TokenInfoTrans,
		type SearchResp,
		type SummonReq,
		type TokenInfo,
	} from '$defs/keyword';
	import { searchToken, summonToken } from '$lib/api/keyword';
	import copy from 'copy-to-clipboard';

	export let isExpand: boolean = true;

	/**生成会员码的数据*/
	const summonData: SummonReq = {
		amount: 10,
		expire: Date.now() + 1000 * 60 * 60 * 24 * 30,
		value: 10,
	};

	/**生成的token*/
	let summonedTokens: string[] | undefined = undefined;
	const summon = async (e: any) => {
		if (Object.values(sdi).some((x) => x)) return;

		const target = e.target as HTMLButtonElement;
		target.ariaBusy = 'true';
		target.disabled = true;

		summonedTokens = await summonToken(fetch, summonData);

		target.ariaBusy = 'false';
		target.disabled = false;
		target.classList.add('success');
		setTimeout(() => target.classList.remove('success'), 1000);
	};

	/**生成数据是否有误(summon data invalid => sdi)*/
	const sdi: { [k in keyof SummonReq]?: boolean } = {};
	$: sdi.amount = isNaN(summonData?.amount || NaN);
	$: sdi.value = isNaN(summonData?.value || NaN);
	$: sdi.expire =
		typeof summonData?.expire !== 'undefined' &&
		(isNaN(summonData?.expire || NaN) || summonData.expire < Date.now());

	/**搜索用数据*/
	const searchData: SearchReq = new SearchReq();
	$: if (searchData.useTime && searchData.type != 1) searchData.type = 1;
	const searchResult: {
		/**搜索结果*/
		result?: SearchResp;
		hide: { [k in keyof TokenInfo]?: boolean };
		/**详细展示*/
		detail?: TokenInfo;
		/**详细展示面板打开状态*/
		open: boolean;
		/**是否详细展示原始数据*/
		raw: boolean;
	} = { hide: {}, open: false, raw: false };
	const doSearch = async (e: any) => {
		const target = e.target as HTMLButtonElement;
		target.ariaBusy = 'true';
		target.disabled = true;

		searchResult.result = await searchToken(fetch, searchData);

		target.ariaBusy = 'false';
		target.disabled = false;
		target.classList.add('success');
		setTimeout(() => target.classList.remove('success'), 1000);

		isExpand = true;
	};

	/**
	 * 复制处理
	 * @param e 点击事件
	 * @param txt 复制的文字
	 * @param showHtml 替换元素的html, 不指定则不替换
	 */
	function copyHandle(e: MouseEvent, txt: string, showHtml?: string) {
		copy(txt);
		let target = e.target as HTMLElement;
		while (!target.classList.contains('copy-target')) target = target.parentElement!;
		target.classList.add('copied');
		const old = target.innerHTML;
		if (typeof showHtml === 'string') target.innerHTML = showHtml;
		setTimeout(() => {
			target.classList.remove('copied');
			if (typeof showHtml === 'string') target.innerHTML = old;
		}, 2000);
	}

	/**
	 * 尝试获取错误
	 * @param resp 响应
	 */
	function getErr(resp: any) {
		if (resp.err) return resp.err;
		return `${resp.status || ''} ${resp.error || ''}`;
	}
</script>

<div>
	<h3>创建会员码</h3>

	<label>
		创建数量
		<input type="number" bind:value={summonData.amount} aria-invalid={sdi.amount} />
	</label>
	<label>
		每个会员码价值(VIP天数)
		<input type="number" bind:value={summonData.value} aria-invalid={sdi.value} />
	</label>
	<Datetime label="过期时间" bind:time={summonData.expire} invalid={sdi.expire} />
	<button disabled={Object.values(sdi).some((x) => x)} on:click={summon}>生成</button>
	<span class="close disabled" />
	{#if summonedTokens}
		<details open>
			<!-- svelte-ignore a11y-no-redundant-roles -->
			<summary role="button" class="contrast">刚刚创建的会员码</summary>

			<article>
				<div>
					<div class="row tools">
						<!--
                             TODO iconfont功能升级, 暂时无法添加剪贴板图标
                             在两个按钮及每一个token前添加一个剪切板图标
                        -->
						<div class="col-3">
							<button
								class="copy-target"
								on:click={(e) => copyHandle(e, (summonedTokens || []).join('\n'), '已复制！')}
							>
								文本
							</button>
						</div>
						<div class="col-3">
							<button
								class="copy-target"
								on:click={(e) => copyHandle(e, JSON.stringify(summonedTokens), '已复制！')}
							>
								json
							</button>
						</div>
					</div>
					<div class="token-box">
						<table role="grid">
							<tbody>
								{#each summonedTokens as t}
									<tr>
										<td>
											<span on:click={(e) => copyHandle(e, t)} class="copy-target">
												<Icon size={null} icon="expand" />
												<Icon icon="expand" />
											</span>
											{t}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</article>
		</details>
	{/if}
</div>
<div>
	<h3>查询会员码</h3>
	<div class="row">
		<fieldset class="col-12 col-md-7">
			<label>
				使用者
				<input
					type="text"
					bind:value={searchData.user}
					placeholder="指定使用者的ID / 名称 / 邮箱"
				/>
			</label>
			<label>
				生成者
				<input
					type="text"
					bind:value={searchData.summoner}
					placeholder="指定生成者的ID / 名称 / 邮箱"
				/>
			</label>
		</fieldset>
		<fieldset class="col-12 col-md-5">
			<legend>使用情况</legend>
			<label>
				<input
					type="radio"
					value={0}
					disabled={!!searchData.useTime}
					checked
					bind:group={searchData.type}
				/>
				全部
			</label>
			<label>
				<input type="radio" value={1} checked bind:group={searchData.type} />
				已使用
			</label>
			<label>
				<input
					type="radio"
					value={2}
					disabled={!!searchData.useTime}
					checked
					bind:group={searchData.type}
				/>
				未使用
			</label>
		</fieldset>
		<fieldset class="col-12">
			<DatetimeRange bind:time={searchData.summonTime} label="生成时间区间" />
		</fieldset>
		<fieldset class="col-12">
			<DatetimeRange bind:time={searchData.expireTime} label="过期时间区间" />
		</fieldset>
		{#if searchData.type != 2}
			<fieldset class="col-12">
				<DatetimeRange bind:time={searchData.useTime} label="使用时间区间" />
			</fieldset>
		{/if}
		<fieldset class="col-12">
			<button on:click={doSearch}>查询</button>
		</fieldset>
	</div>
	{#if searchResult?.result?.list}
		<table class="search-result">
			<thead>
				<tr>
					{#each TokenInfoKeys as key}
						{#if !searchResult.hide[key]}
							<th data-tooltip="点击隐藏" on:click={() => (searchResult.hide[key] = true)}>
								{TokenInfoName[key]}
							</th>
						{/if}
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each searchResult.result.list as info}
					<tr
						on:click={() => {
							searchResult.detail = info;
							searchResult.open = true;
						}}
					>
						{#each TokenInfoKeys as key}
							{#if !searchResult.hide[key]}
								<td>
									{TokenInfoTrans[key](info[key])}
								</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
			<tfoot>
				{#if Object.values(searchResult.hide).some((x) => x)}
					<tr>
						<td colspan={TokenInfoKeys.length}>
							已隐藏的结果列:
							{#each TokenInfoKeys.filter((k) => searchResult.hide[k]) as key, i}
								{#if i},&nbsp;{/if}
								<span role="link" on:click={() => (searchResult.hide[key] = false)}>
									{TokenInfoName[key]}
								</span>
							{/each}
						</td>
					</tr>
				{/if}
			</tfoot>
		</table>
		{#if searchResult.detail}
			<Dialog bind:open={searchResult.open}>
				<h1>会员码详细信息</h1>
				<label>
					<input type="checkbox" role="switch" bind:checked={searchResult.raw} />
					原始信息
				</label>
				<table>
					{#each TokenInfoKeys as key}
						<tr>
							<td>
								{TokenInfoName[key]}
							</td>
							<td>
								{searchResult.raw
									? searchResult.detail[key]
									: TokenInfoTrans[key](searchResult.detail[key], 1)}
							</td>
						</tr>
					{/each}
				</table>
			</Dialog>
		{/if}
	{:else if searchResult.result}
		<h1>啊哦, 发生错误了</h1>
		<p>{getErr(searchResult.result)}</p>
	{/if}

	{#if dev}
		<h4>开发者预览</h4>
		搜索数据:
		<pre>{JSON.stringify(searchData, null, 4)}</pre>
		搜索响应:
		<pre>{JSON.stringify(searchResult, null, 4)}</pre>
	{/if}
</div>

<style>
	.token-box {
		overflow-x: hidden;
	}
	.token-box tr td {
		white-space: nowrap;
	}
	.token-box tr td > span {
		position: relative;
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.1s;
		margin-right: 5px;
		font-size: 1em;
	}
	.token-box tr:hover td > span,
	.token-box tr td:hover > span {
		opacity: 1;
	}
	.token-box tr td > span :global(*) {
		opacity: 0;
	}
	.token-box tr td > span :global(*):first-child {
		opacity: 1;
		position: absolute;
		top: 0.15em;
	}
	.token-box tr td > span:hover :global(*):first-child {
		font-size: 1.3em;
		top: 0.075em;
		left: -0.075em;
	}
	.token-box :global(.copied) {
		color: var(--bs-teal);
	}
	button:global(.copied),
	button:global(.success) {
		--background-color: var(--bs-teal);
		--border-color: var(--bs-teal);
		--box-shadow: none;
	}
	.search-result thead th {
		white-space: nowrap;
	}
	.search-result tbody tr {
		cursor: pointer;
	}
	.search-result tbody tr:hover {
		background-color: var(--primary-focus);
	}
</style>
