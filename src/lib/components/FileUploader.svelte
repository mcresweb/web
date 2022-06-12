<script lang="ts">
	import { runAll, type task } from '$helpers/concurrent';
	import type { FileUploaderFunc, SubmitStat, SubmitStatUpdater } from '$helpers/files';
	import { changeStoreUnit } from '$helpers/unit';
	import { uploadFile } from '$lib/api/content';
	import Icon from './Icon.svelte';

	/**
	 * 所有文件
	 */
	let files: File[] = [];

	let filesIn: FileList | null = null;
	const updateFiles = (filesIn: FileList) => {
		for (let i = 0; i < filesIn.length; i++) {
			const file = filesIn.item(i);
			if (!file) continue;
			files.push(file);
		}
		files = files;
	};
	$: if (filesIn) updateFiles(filesIn);

	export const upload: FileUploaderFunc<number> = (essay, statCb) =>
		new Promise<boolean>((resolve) => {
			/**上传状态*/
			const submitStat: Record<string, SubmitStat> = {};
			statCb && statCb(submitStat);
			if (!(files.length > 0)) return resolve(true);
			const tasks: task[] = files.map((file, i) => {
				const key = file.name + ' ' + i + ' ' + Date.now();
				const stat: SubmitStat = (submitStat[key] = {
					name: file.name,
					msg: '准备中',
				});
				return async () => {
					/**
					 * 更新函数, 更新当前提交进度
					 * @param type 更新字段
					 * @param val 更新数据
					 */
					const update: SubmitStatUpdater = (type, val) => {
						stat[type] = val;
						statCb && statCb(submitStat);
					};
					update('msg', '开始上传');
					update('now', undefined);
					update('tot', 1);
					const resp = await uploadFile(fetch, essay, file);
					update('now', resp.success ? 1 : -1);
					update('msg', resp.success ? resp.id.join('') : resp.err);
					update('over', true);
				};
			});
			runAll(
				{
					overCallback: () => {
						resolve(!Object.values(submitStat).some((x) => (x.now || 0) < 0));
					},
					limit: 4,
				},
				...tasks,
			);
		});
</script>

<label>
	文件上传
	<input type="file" multiple bind:files={filesIn} />
</label>
<table role="grid">
	<thead>
		<tr>
			<th>文件名</th>
			<th>文件大小</th>
		</tr>
	</thead>
	<tbody>
		{#each files as f, i}
			<tr class="file-line">
				<td
					>{f.name}
					<span class="remove-file" on:click={() => (files.splice(i, 1), (files = files))}
						><Icon icon="guanbi" /></span
					></td
				>
				<td>{changeStoreUnit(f.size, 'B')}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.remove-file {
		margin-left: 20px;
		opacity: 0;
		cursor: pointer;
		font-weight: bolder;
		font-size: 1.1em;
		display: inline-block;
		height: 100%;
		color: var(--bs-red);
		transition: opacity 0.15s;
	}
	.file-line:hover .remove-file {
		opacity: 1;
	}
</style>
