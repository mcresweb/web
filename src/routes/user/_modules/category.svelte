<script lang="ts">
	import { browser } from '$app/env';

	import type { Category, ModCategoryRequest } from '$defs/content';
	import { listCatalogue, listCategory, modCategory } from '$lib/api/content';

	export let isExpand: boolean = false;

	let adder: { [k in keyof Category]: Category[k] | undefined } = {
		index: undefined,
		title: undefined,
		key: undefined,
	};

	let catalogue: string | undefined = undefined;

	/**是否正在修改中*/
	let modifying = false;
	/**原始值*/
	let category: Category[] | undefined = undefined;
	/**修改值*/
	let edit: Category[];
	/** 当前正在编辑的域 */
	let editing: number = -1;
	/**是否正在加载中*/
	let loading = false;
	const getCategory = async (cata?: string | undefined) => {
		loading = true;
		try {
			if (!cata) cata = catalogue;
			if (!cata) {
				category = undefined;
				return;
			}
			const cs = await listCategory(fetch, cata);
			if (!cs) {
				category = undefined;
				return;
			}
			category = cs;
			edit = cs.map((x) => ({ ...x }));
			editing = -1;
			for (const k in adder) adder[k as keyof typeof adder] = undefined;
		} finally {
			loading = false;
		}
	};

	$: if (browser && catalogue) getCategory();

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
			if (!key || !catalogue) return alert('Error');
			loading = true;
			const resp = await modCategory(fetch, { catalogue, key: key });
			if (!resp.success) alert(resp.err);
			await getCategory();
		},
		mod: async (cate: Category | typeof adder) => {
			if (!cate.key || !catalogue) return alert('Error');
			loading = true;
			const data: ModCategoryRequest = {
				name: cate.title || '',
				img: cate.img,
				key: cate.key,
				index: cate.index + '',
				catalogue,
			};
			const resp = await modCategory(fetch, data);
			if (!resp.success) alert(resp.err);
			await getCategory();
		},
	};
</script>

{#await listCatalogue(fetch) then catalogues}
	<select bind:value={catalogue}>
		{#each catalogues as cata}
			<option value={cata.key}>{cata.key} - {cata.title}</option>
		{/each}
	</select>
{/await}

{#if loading}
	<button aria-busy="true" disabled class="secondary">交换数据中...</button>
{:else if category}
	<table role="grid">
		<thead>
			<tr>
				<th>序号</th><th>键</th><th>名称</th>{#if modifying}<th>操作</th>{/if}
			</tr>
		</thead>
		<tbody id="category">
			{#each category as cate, i (i)}
				{@const disabled = (editing >= 0 && editing != i) || Object.values(adder).some((x) => x)}

				<tr>
					{#if modifying}
						<td>
							<input
								{disabled}
								bind:value={edit[i].index}
								aria-invalid={edit[i].index == cate.index
									? undefined
									: isNaN(edit[i].index || NaN /**empty string*/)}
							/>
						</td>
						<td>
							<input
								{disabled}
								bind:value={edit[i].key}
								aria-invalid={edit[i].key == cate.key
									? undefined
									: category.some((x) => x.key == edit[i].key)}
							/>
						</td>
						<td>
							<input
								{disabled}
								bind:value={edit[i].title}
								aria-invalid={edit[i].title == cate.title ? undefined : !edit[i].title}
							/>
						</td>
						<td>
							{#if equals(cate, edit[i], i)}
								<button {disabled} class="del" on:click={() => modFunc.del(cate.key)}>删除</button>
							{:else}
								<button
									disabled={disabled ||
										!edit[i].key ||
										!edit[i].title ||
										isNaN(edit[i].index || NaN /**empty string*/) ||
										(edit[i].key != cate.key && category.some((x) => x.key == edit[i].key))}
									class="mod"
									on:click={() => modFunc.mod(edit[i])}>修改</button
								>
							{/if}
						</td>
					{:else}
						<td>{cate.index}</td>
						<td>{cate.key}</td>
						<td>{cate.title}</td>
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
							aria-invalid={adder.key ? category.some((x) => x.key == adder.key) : undefined}
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
								category.some((x) => x.key == adder.key)}
							on:click={() => modFunc.mod(adder)}>添加</button
						>
					</td>
				</tr>
			{/if}
		</tbody>
		<tfoot>
			{#if modifying && catalogue}
				{@const hasEdit = editing >= 0 || Object.values(adder).some((x) => x)}
				<tr
					on:click={() =>
						hasEdit
							? getCategory()
							: getCategory().then(() => ((modifying = false), (isExpand = false)))}
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
	#category button.del {
		background-color: var(--del-color);
		border-color: var(--del-color);
	}
</style>
