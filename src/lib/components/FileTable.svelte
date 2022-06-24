<script lang="ts">
	import type { FileList } from '$defs/content';
	import { changeStoreUnit } from '$helpers/unit';
	import { fileUrl } from '$lib/api/content';
	import Dialog from './Dialog.svelte';
	import Icon from './Icon.svelte';

	/**内容ID*/
	export let id: number;

	/**
	 * 资源列表 / 错误信息
	 */
	export let files: FileList | string;

	/** 资源的内部状态 */
	let stat: Record<string, { sha1: boolean }> = {};
	const setInfo = (info: FileList): 1 => {
		info.files.forEach((f) => (stat[f.id] = { sha1: false }));
		return 1;
	};
</script>

{#if !files || typeof files === 'string'}
	无法获取资源: <span>{files}</span>
{:else if setInfo(files)}
	<table role="grid" id="res_list">
		<thead>
			<tr>
				<th>文件名</th>
				<th>大小</th>
				<th>校验</th>
				<slot name="func-head">
					<th>下载</th>
				</slot>
			</tr>
		</thead>
		<tbody>
			{#each files.files as file}
				<tr>
					<td class="txt">{file.name}</td>
					<td class="txt">{changeStoreUnit(file.size, 'B')}</td>
					<td
						class="icon"
						on:click={() => {
							stat[file.id] = { ...stat[file.id], sha1: true };
						}}
					>
						<span data-tooltip="点击显示文件的SHA1值">
							<Icon icon="xiaoyan" size={1.8} />
						</span>
					</td>
					<slot name="func-body" {file}>
						<td class="icon">
							<a href={fileUrl(id, file.id)} target="_blank">
								<span data-tooltip="点击下载此文件">
									<Icon icon="24px" size={1.8} />
								</span>
							</a>
						</td>
					</slot>
				</tr>
				<Dialog bind:open={stat[file.id].sha1}>
					<h1>文件校验</h1>
					<table>
						<tr><td>内容ID</td><td>{id}</td></tr>
						<tr><td>文件ID</td><td>{file.id}</td></tr>
						<tr><td>文件名称</td><td>{file.name}</td></tr>
						<tr><td>文件SHA1</td><td>{file.sha1}</td></tr>
					</table>
				</Dialog>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td>共计 {files.files.length} 个文件</td>
			</tr>
		</tfoot>
	</table>
{/if}

<style>
	#res_list .icon {
		width: 10%;
	}
</style>
