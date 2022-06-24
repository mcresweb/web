<script context="module" lang="ts">
	export const load: Load = async ({ params }) => {
		if (!browser) return {};
		const { id } = params;
		const raw = await getEssayEditData(fetch, parseInt(id));
		if (!raw) {
			return { status: 404, error: `找不到ID为 ${params.id} 的内容` };
		} else if (raw.bad) {
			return { status: raw.status, error: raw.err };
		}
		return { props: { raw, editId: id } };
	};
</script>

<script lang="ts">
	import { editEssay, getEssayEditData, listFile, removeFile } from '$lib/api/content';
	import { browser } from '$app/env';
	import type { Load } from '@sveltejs/kit';
	import EssayEdit from '$components/EssayEdit.svelte';
	import type { EssayUpload, FileInfo } from '$defs/content';
	import FileTable from '$components/FileTable.svelte';
	import Icon from '$components/Icon.svelte';
	import Dialog from '$components/Dialog.svelte';

	export let editId: number;
	/** 原始数据 */
	export let raw: EssayUpload;

	/**正在删除的文件UUID*/
	let removeingFile: FileInfo;
	let removeingFileOpen: boolean = false;
	$: if (removeingFile) removeingFileOpen = true;

	/**删除文件错误*/
	let removeFileErr: string;
	let removeFileErrOpen: boolean = false;
	$: if (removeFileErr) removeFileErrOpen = true;
</script>

{#if browser}
	<div class="container">
		<article>
			<EssayEdit {raw} uploadEssay={(data) => editEssay(fetch, editId, data)}>
				<div slot="after-file">
					<label for="exist-file">
						{#await listFile(fetch, editId) then files}
							已有文件
							<FileTable id={editId} {files} let:file>
								<th slot="func-head"> 删除 </th>
								<td slot="func-body">
									<span
										on:click={() => (removeingFile = file)}
										data-tooltip="点击删除已存在的文件"
										style:color="var(--bs-red)"
									>
										<Icon icon="guanbi" size={1.4} />
									</span>
								</td>
							</FileTable>
							<Dialog open={removeingFileOpen}>
								<h1>
									是否要删除文件: <span style:color="var(--bs-info)">{removeingFile?.name}</span> ?
								</h1>
								<div class="grid">
									<button class="secondary" on:click={() => (removeingFileOpen = false)}
										>取消</button
									>
									<button
										on:click={() => {
											removeFile(fetch, editId, removeingFile.id).then(
												(resp) => resp.success || (removeFileErr = resp.err),
											);
											removeingFileOpen = false;
										}}>删除</button
									>
								</div>
							</Dialog>
							<Dialog open={removeFileErrOpen}>
								<h1>
									删除文件: <span style:color="var(--bs-info)">{removeingFile?.name}</span> 失败
								</h1>
								<p>{removeFileErr}</p>
							</Dialog>
						{/await}
					</label>
				</div>
			</EssayEdit>
		</article>
	</div>
	<!-- <Dialog open={removeingFileOpen}>
		<h1>是否要删除文件: {removeingFile.name} ?</h1>
		<div class="grid">
			<button>取消</button>
			<button>删除</button>
		</div>
	</Dialog> -->
{/if}

<style>
	label {
		border-radius: 10px;
		border: 1px solid var(--form-element-border-color);
		padding: 10px;
	}
</style>
