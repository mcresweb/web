<script lang="ts">
	import { browser } from '$app/env';
	import type { Catalogue, ModCatalogueRequest } from '$defs/content';
	import { listCatalogue, modCatalogue } from '$lib/api/content';

	export let isExpand: boolean = false;

	let adder: { [k in keyof Catalogue]: Catalogue[k] | undefined } = {
		index: undefined,
		title: undefined,
		key: undefined,
	};

	/**是否正在修改中*/
	let modifying = false;
	/**原始值*/
	let catalogues: Catalogue[];
	/**修改值*/
	let edit: Catalogue[];
	/** 当前正在编辑的域 */
	let editing: number = -1;
	/**是否正在加载中*/
	let loading = false;
	const getCatalogues = async () => {
		//TODO clear sessionStorge
		loading = true;
		try {
			catalogues = await listCatalogue(fetch);
			edit = catalogues.map((x) => ({ ...x }));
			editing = -1;
			for (const k in adder) adder[k as keyof typeof adder] = undefined;
		} finally {
			loading = false;
		}
	};
	if (browser) getCatalogues();

	/**判断两个元素是否相等*/
	const equals = <T = any>(o1: T, o2: T, i: number): boolean => {
		if (editing >= 0 && editing != i) return true;
		let r = true;
		for (let k in o1)
			if (o1[k] != o2[k]) {
				r = false;
				break;
			}

		if (r) editing = -1;
		else editing = i;

		return r;
	};

	const modFunc = {
		del: async (key: string) => {
			loading = true;
			const resp = await modCatalogue(fetch, { key: key });
			if (!resp.success) alert(resp.err);
			await getCatalogues();
		},
		mod: async (cata: Catalogue | typeof adder) => {
			if (!cata.key) return alert('Error');

			loading = true;
			const data: ModCatalogueRequest = {
				index: cata.index + '',
				img: cata.img,
				name: cata.title || '',
				key: cata.key,
			};
			const resp = await modCatalogue(fetch, data);
			if (!resp.success) alert(resp.err);
			await getCatalogues();
		},
	};
</script>

{#if loading}
	<button aria-busy="true" disabled class="secondary">交换数据中...</button>
{:else if catalogues}
	<table role="grid">
		<thead>
			<tr>
				<th>序号</th><th>键</th><th>名称</th>{#if modifying}<th>操作</th>{/if}
			</tr>
		</thead>
		<tbody id="catalogues">
			{#each catalogues as cata, i (i)}
				{@const disabled = (editing >= 0 && editing != i) || Object.values(adder).some((x) => x)}

				<tr>
					{#if modifying}
						<td>
							<input
								{disabled}
								bind:value={edit[i].index}
								aria-invalid={edit[i].index == cata.index
									? undefined
									: isNaN(edit[i].index || NaN /**empty string*/)}
							/>
						</td>
						<td>
							<input
								{disabled}
								bind:value={edit[i].key}
								aria-invalid={edit[i].key == cata.key
									? undefined
									: catalogues.some((x) => x.key == edit[i].key)}
							/>
						</td>
						<td>
							<input
								{disabled}
								bind:value={edit[i].title}
								aria-invalid={edit[i].title == cata.title ? undefined : !edit[i].title}
							/>
						</td>
						<td>
							{#if equals(cata, edit[i], i)}
								<button {disabled} class="del" on:click={() => modFunc.del(cata.key)}>删除</button>
							{:else}
								<button
									disabled={disabled ||
										!edit[i].key ||
										!edit[i].title ||
										isNaN(edit[i].index || NaN /**empty string*/) ||
										(edit[i].key != cata.key && catalogues.some((x) => x.key == edit[i].key))}
									class="mod"
									on:click={() => modFunc.mod(edit[i])}>修改</button
								>
							{/if}
						</td>
					{:else}
						<td>{cata.index}</td>
						<td>{cata.key}</td>
						<td>{cata.title}</td>
					{/if}
				</tr>
			{/each}

			{#if modifying}
				{@const disabled = editing >= 0}
				<tr>
					<td>
						<input
							{disabled}
							bind:value={adder.index}
							aria-invalid={adder.index ? isNaN(adder.index || NaN /**empty string*/) : undefined}
						/>
					</td>
					<td>
						<input
							{disabled}
							bind:value={adder.key}
							aria-invalid={adder.key ? catalogues.some((x) => x.key == adder.key) : undefined}
						/>
					</td>
					<td>
						<input
							{disabled}
							bind:value={adder.title}
							aria-invalid={adder.title ? false : undefined}
						/>
					</td>
					<td>
						<button
							disabled={disabled ||
								isNaN(adder.index || NaN /**empty string*/) ||
								!adder.key ||
								!adder.title ||
								catalogues.some((x) => x.key == adder.key)}
							on:click={() => modFunc.mod(adder)}>添加</button
						>
					</td>
				</tr>
			{/if}
		</tbody>
		<tfoot>
			{#if modifying}
				{@const hasEdit = editing >= 0 || Object.values(adder).some((x) => x)}
				<tr
					on:click={() =>
						hasEdit
							? getCatalogues()
							: getCatalogues().then(() => ((modifying = false), (isExpand = false)))}
				>
					<td
						colspan="3"
						style:text-align="center"
						style:cursor="pointer"
						style:background-color="var(--primary)"
						style:color="var(--primary-inverse)"
					>
						{hasEdit ? '重置' : '取消'}
					</td>
				</tr>
			{:else}
				<tr on:click={() => ((modifying = true), (isExpand = true))}>
					<td
						colspan="3"
						style:text-align="center"
						style:cursor="pointer"
						style:background-color="var(--primary)"
						style:color="var(--primary-inverse)"
					>
						修改
					</td>
				</tr>
			{/if}
		</tfoot>
	</table>
{/if}

<style>
	table {
		white-space: nowrap;
	}
	#catalogues button.del {
		background-color: var(--del-color);
		border-color: var(--del-color);
	}
</style>
