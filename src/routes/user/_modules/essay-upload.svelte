<script lang="ts">
	import type { FileUploaderFunc, SubmitStat } from '$helpers/files';
	import { contentType, type Category, type EssayUpload } from '$defs/content';
	import { essayUrl, listCatalogue, listCategory, uploadEssay } from '$lib/api/content';
	import { browser, dev } from '$app/env';
	import { marked } from 'marked';
	import { bbcode, supportTags } from '$helpers/bbcode';
	import Dialog from '$components/Dialog.svelte';
	import { goto } from '$app/navigation';
	import ImgUploader from '$components/ImgUploader.svelte';
	import { allowDrop, drop } from '$helpers/drag-event';
	import Progress from '$components/Progress.svelte';
	import type { ImgUsing } from '$defs/img';
	import FileUploader from '$components/FileUploader.svelte';
	import { blur } from 'svelte/transition';

	export let isExpand: boolean = true;
	const expand = () => (isExpand = true);

	/** 原始数据 */
	const raw: EssayUpload = browser ? JSON.parse(localStorage.getItem('aaa') || '{}') : ({} as any);

	$: if (browser) localStorage.setItem('aaa', JSON.stringify(raw));

	//小分类处理
	let oldCatalogue: string = '';
	let categorys: Category[] | null = null;
	$: if (oldCatalogue != raw.catalogue && raw.catalogue)
		listCategory(fetch, (oldCatalogue = raw.catalogue)).then((r) => (categorys = r));

	/** 添加tag */
	const addTag = (event: any) => {
		const val = event.target.value;
		if (!val) return;
		raw.tags = [...(raw.tags || []), val];
		event.target.value = '';
	};

	/** 正文预览 */
	let preview = false;

	/**
	 * 预览模式的文字翻译
	 *
	 * 将图片代码转换为图片路径
	 * @param txt 输入文字
	 * @returns 输出文字
	 */
	let transText: (txt: string) => string = (txt) => txt;

	/** 是否禁止上传 */
	$: disabled =
		uploading || !(raw.catalogue && raw.category && raw.content && raw.title && raw.type);
	/** 提示检查框的打开状态 */
	let checkDialogOpen: boolean;
	/** 提示确认框的打开状态 */
	let confirmDialogOpen: boolean | 1 | 0;
	/** 显示错误的打开状态 */
	let errDialogOpen: boolean;
	/** 显示的错误 */
	let showErr: string | undefined;
	$: if (!errDialogOpen) showErr = undefined;
	/** 上传前确认 */
	const uploadConfirm = () => {
		if (disabled) {
			checkDialogOpen = true;
			return false;
		}
		return (confirmDialogOpen = true);
	};
	/**上传状态*/
	let uploading: boolean;
	let uploadImgFunc: FileUploaderFunc<string> | undefined;
	let uploadStatus: Record<string, SubmitStat>;
	let getImgs: () => Record<string, ImgUsing>;
	let uploadFileFunc: FileUploaderFunc<number> | undefined;

	const upload = async () => {
		uploadStatus = {};
		uploading = true;
		const data: EssayUpload = { ...raw };
		try {
			//上传图片
			if (
				!(await uploadImgFunc!(data.content, (stat) => {
					uploadStatus = stat;
				}))
			) {
				showErr = [
					'上传图片失败: ',
					...Object.values(uploadStatus).map(
						(x) => `<p>${x.name}<br>${(x.now || 0) < 0 ? x.msg : '成功'}</p>`,
					),
				].join('<br>');
				errDialogOpen = true;
				return;
			}
			//翻译正文
			data.content = transText(data.content);
			//设置图片
			data.imgs = getImgs();
			//上传内容
			const resp = await uploadEssay(fetch, data);
			if (!resp.success) {
				showErr = resp.err;
				errDialogOpen = true;
				return;
			}
			//上传文件
			if (!(await uploadFileFunc!(resp.id, (stat) => (uploadStatus = stat)))) {
				showErr = [
					'上传文件失败: ',
					...Object.values(uploadStatus).map(
						(x) => `<p>${x.name}<br>${(x.now || 0) < 0 ? x.msg : '成功'}</p>`,
					),
				].join('<br>');
				errDialogOpen = true;
				return;
			}
			//跳转
			goto(essayUrl(resp.id));
		} finally {
			uploading = false;
			confirmDialogOpen = 0;
		}
	};

	let contentInput: HTMLTextAreaElement;
</script>

<div on:click={expand}>
	{#await listCatalogue(fetch)}
		<label> 大分类 <select /> </label>
	{:then cata}
		<label>
			大分类
			<select bind:value={raw.catalogue}>
				{#each cata as c}
					<option value={c.key}>{c.key} - {c.title}</option>
				{/each}
			</select>
		</label>
	{/await}
	{#if categorys}
		<label>
			小分类
			<select bind:value={raw.category}>
				{#each categorys as c}
					<option value={c.key}>{c.key} - {c.title}</option>
				{/each}
			</select>
		</label>
	{:else}
		<label> 小分类 <select /> </label>
	{/if}
	<div>
		<label>
			标题
			<input type="text" placeholder="内容的标题" bind:value={raw.title} />
		</label>
		<label>
			描述
			<input type="text" placeholder="简短的描述" bind:value={raw.description} />
		</label>
		<label>
			内容语言
			<select bind:value={raw.type}>
				{#each contentType as value}
					<option {value}>{value}</option>
				{/each}
			</select>
			<small>
				{#if raw.type === 'markdown'}
					一种轻量级标记语言, 使用此格式将同时支持 <b> html </b> 及 <b> markdown </b>,
					<a href="https://www.runoob.com/markdown/md-tutorial.html" target="_blank">菜鸟教程</a>
				{:else if raw.type === 'bbcode'}
					一种轻量级标记语言, 使用此格式将同时支持 <b> html </b> 及 <b> bbcode </b>,
					此语言格式支持不佳, 请谨慎使用,
					<a href="https://www.bbcode.org/reference.php" target="_blank">官网参考</a>
				{:else if raw.type === 'html'}
					原生 html , 将直接当做 <b> html </b> 插入页面中
				{:else if raw.type === 'text'}
					将直接当做文本插入页面中
				{/if}
			</small>
		</label>
		<label for="content">
			内容
			<div class="tab-nav row">
				<div
					class="col-6 col-lg-3 col-xl-1"
					class:active={!preview}
					on:click={() => (preview = false)}
				>
					编辑
				</div>
				<div
					class="col-6 col-lg-3 col-xl-1"
					class:active={preview}
					on:click={() => (preview = true)}
				>
					预览
				</div>
			</div>
			{#if preview}
				<div class="preview">
					{#if raw.content}
						{#if raw.type === 'markdown'}
							{@html marked(transText(raw.content))}
						{:else if raw.type === 'bbcode'}
							{@html bbcode(transText(raw.content))}
						{:else if raw.type === 'html'}
							{@html transText(raw.content)}
						{:else if raw.type === 'text'}
							{transText(raw.content)}
						{:else}
							<h3 style:color="var(--bs-danger)">错误: 未知的正文类型</h3>
						{/if}
					{:else}
						<h3>暂无内容</h3>
					{/if}
				</div>
			{:else}
				<textarea
					id="content"
					placeholder="内容的正文"
					bind:value={raw.content}
					bind:this={contentInput}
					on:drop={(e) =>
						drop(e, (txt) => {
							const content = raw.content || '';
							raw.content =
								content.substring(0, contentInput.selectionStart) +
								txt +
								content.substring(contentInput.selectionEnd);
						})}
					on:dragover={allowDrop}
				/>
				<small>
					右下角可以拖动调整高度, 推荐使用本地编辑器编辑完成后再粘贴至此
					{#if raw.type === 'bbcode'}
						<br />
						bbcode支持的标签:
						{#each supportTags as tag, i}
							{#if i},{/if}
							<span style:color="#000" data-tooltip={tag}>{tag}</span>
						{/each}
					{/if}
				</small>
			{/if}
		</label>
		<ImgUploader bind:transText bind:upload={uploadImgFunc} bind:getImgs bind:txt={raw.content} />
		<FileUploader bind:upload={uploadFileFunc} />
		<label for="tags">
			标签
			<div id="tags" class="grid">
				{#if raw.tags}
					{#each raw.tags as t, i (i)}
						<div>
							<input
								bind:value={t}
								on:blur={() => raw.tags && !t && (raw.tags = raw.tags.filter((x) => x))}
							/>
						</div>
					{/each}
				{/if}
				<div>
					<input
						on:blur={addTag}
						on:keyup={(e) => e.key === 'Enter' && addTag(e)}
						placeholder="添加标签"
					/>
				</div>
			</div>
		</label>
		<button {disabled} on:click={uploadConfirm}>上传</button>
	</div>
	<Dialog bind:open={checkDialogOpen}>
		<h2>请检查</h2>
		还有必填内容未填写
		<button on:click={() => (checkDialogOpen = false)}>确认</button>
	</Dialog>
	<Dialog bind:open={confirmDialogOpen}>
		{#if uploading}
			<h2>上传中</h2>

			{#if uploadStatus}
				<table>
					{#each Object.keys(uploadStatus) as k (k)}
						{#if !uploadStatus[k].over || (uploadStatus[k].now || 0) < 0}
							<tr out:blur={{ delay: 1500 }}>
								<td>{uploadStatus[k].name}</td>
							</tr>
							<tr out:blur={{ delay: 1500 }}>
								<td>
									<Progress
										value={(uploadStatus[k].now || 0) < 0
											? uploadStatus[k].tot || 1
											: uploadStatus[k].now}
										max={uploadStatus[k].tot || 1}
										txt={uploadStatus[k].msg}
										color={(uploadStatus[k].now || 0) < 0
											? '#d9534f'
											: uploadStatus[k].over
											? '#5cb85c'
											: '#5bc0de'}
										floatTxt
									/>
								</td>
							</tr>
						{/if}
					{/each}
				</table>
			{:else}
				<progress />
			{/if}
		{:else}
			<h2>确认上传内容吗?</h2>
			上传后将不可删除(仅可以锁定和修改)
		{/if}
		<div class="grid" style:display={uploading ? 'none' : ''}>
			<button class="outline" on:click={() => (confirmDialogOpen = false)}>取消</button>
			<button on:click={upload}>确认</button>
		</div>
	</Dialog>
	<Dialog bind:open={errDialogOpen}>
		<h2>发生错误</h2>
		{@html showErr}
	</Dialog>
	{#if dev}
		<h5>开发模式预览:</h5>
		<ul>
			<li>checkDialogOpen {checkDialogOpen}</li>
			<li>confirmDialogOpen {confirmDialogOpen}</li>
			<li>errDialogOpen {errDialogOpen}</li>
			<li>showErr {showErr}</li>
			<li>uploading {uploading}</li>
		</ul>
		<pre>{JSON.stringify(raw, null, 4)}</pre>
	{/if}
</div>

<style>
	textarea {
		resize: vertical;
		min-height: 200px;
	}
	.tab-nav {
		margin: unset;
		margin-bottom: 5px;
		border-bottom: 1px solid #d0d7de;
	}
	.tab-nav div {
		border: 1px solid #d0d7de;
		border-right: none;
		border-bottom: none;
		padding: 10px 0;
		text-align: center;
		background-color: #f6f8fa;
		transition: background-color 0.2s;
		margin: 0;
		cursor: pointer;
	}
	.tab-nav div:first-child {
		border-radius: 5px 0 0 0;
	}
	.tab-nav div:last-child {
		border-radius: 0 5px 0 0;
		border-right: 1px solid #d0d7de;
	}
	.tab-nav div.active {
		background-color: #fff;
	}

	.preview {
		border: 1px solid #d0d7de;
		border-left: none;
		border-right: none;
		padding: 20px 0;
	}
</style>
