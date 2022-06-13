<script lang="ts">
	import { dev } from '$app/env';
	import { ImgUsing, imgUsingDescribe, imgUsingKeys } from '$defs/img';
	import { runAll, type task } from '$helpers/concurrent';
	import { dragstart } from '$helpers/drag-event';
	import {
		newFileReader,
		type FileUploaderFunc,
		type SubmitStat,
		type SubmitStatUpdater,
	} from '$helpers/files';

	import { imgUrl, uploadImg } from '$lib/api/img';
	import { onDestroy } from 'svelte';
	import { cubicIn } from 'svelte/easing';
	import { blur } from 'svelte/transition';

	/** 图片文件列表 */
	let filesIn: FileList | null = null;

	/**文件数据*/
	type FileData = {
		/**文件*/
		file: File;
		/**使用的类型*/
		type: ImgUsing;
		/**错误*/
		err?: string;
		/**本地编号, 用于文本替代*/
		localID: string;
		/**本地图片地址, 用于本地预览*/
		localUrl: string;
		/**元素对象*/
		element?: HTMLImageElement;
		uploaded?: true;
		/**远程uuid(图片真实uuid, 仅在上传后有效)*/
		remoteUUID?: string;
	};
	let filedata: FileData[] = [];
	const resetImgType = (files: FileList) => {
		const rand = ((Math.random() * 36) | 0).toString(36);
		const time = Date.now() * Math.pow(36, files.length.toString(36).length);
		for (let i = 0; i < files.length; i++) {
			const file = files.item(i);
			if (!file) continue;
			filedata.push({
				file,
				type: new ImgUsing(),
				localID: `UIMG-${rand}${(time + i).toString(36).toUpperCase()};`,
				localUrl: URL.createObjectURL(files[i]),
			});
		}
		filedata[0].err = '测试';
	};
	$: if (filesIn) resetImgType(filesIn);

	/**
	 * @returns 图片UUID(服务器) - 图片使用类型
	 */
	export const getImgs = () => {
		const data: Record<string, ImgUsing> = {};
		filedata
			.filter((x) => x.uploaded && x.remoteUUID)
			.forEach((x) => (data[x.remoteUUID!] = x.type));
		return data;
	};

	/**
	 * 上传图片
	 * @param txt 文章正文, 用于判断不必要的图片
	 * @param statCb 状态回调, 每次更新上传进度时调用
	 * @returns 是否成功
	 */
	export const upload: FileUploaderFunc<string> = (txt, statCb) =>
		new Promise<boolean>((resolve) => {
			/**上传状态*/
			const submitStat: Record<string, SubmitStat> = {};
			statCb && statCb(submitStat);
			const data = filedata
				.filter((data) => !data.uploaded)
				.filter(
					(data) =>
						(txt || '').indexOf(data.localID) >= 0 || Object.values(data.type).some((x) => x),
				);
			if (!(data.length > 0)) return resolve(true);
			const tasks: task[] = data.map((data, i) => {
				const file = data.file;
				const key = file.name + ' ' + i + ' ' + Date.now();
				return () =>
					new Promise<void>((r) => {
						const stat: SubmitStat = (submitStat[key] = {
							name: file.name,
							msg: '准备中',
						});
						/**
						 * 更新函数, 更新当前提交进度
						 * @param type 更新字段
						 * @param val 更新数据
						 */
						const update: SubmitStatUpdater = (type, val) => {
							stat[type] = val;
							submitStat[key] = stat;
							statCb && statCb(submitStat);
						};
						newFileReader(update, r, (fr) =>
							uploadImg(fetch, fr.result).then((r) => {
								if (!r.success) data.err = r.err;
								else {
									data.remoteUUID = r.uuid;
									data.uploaded = true;
								}
								filedata = filedata; //update render
								return {
									success: r.success,
									msg: r.success ? r.uuid : r.err,
								};
							}),
						).readAsArrayBuffer(file);
					});
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

	/**
	 * 翻译文本
	 *
	 * 将图片代码转换为图片路径(上传前：本地预览路径，上传后：远程图片路径)
	 * @param text
	 */
	export const transText = (text: string) => {
		filedata.forEach(
			(data) =>
				(text = text.replace(
					new RegExp(data.localID, 'g'),
					data.remoteUUID ? imgUrl(data.remoteUUID) : data.localUrl,
				)),
		);
		return text;
	};

	/**
	 * 释放资源
	 * @param data 数据
	 */
	const revoke = (data: FileData[]) =>
		data.map((d) => d.localUrl).forEach((url) => URL.revokeObjectURL(url));
	onDestroy(() => {
		const data = [...filedata];
		filedata = [];
		revoke(data);
	});

	/** 使用的文字, 用于检测图片是否被使用 */
	export let txt: string;
</script>

<label>
	图片上传
	<input type="file" accept="image/*" multiple bind:files={filesIn} />
</label>

{#if !(filedata.length < 1)}
	<div class="img-view row">
		{#each filedata as data, i (data.localID)}
			<div class="col-12 col-md-6 col-lg-3" out:blur={{ easing: cubicIn }}>
				<fieldset>
					<span
						class="close"
						class:disabled={(txt || '').indexOf(data.localID) >= 0}
						on:click={() => {
							const data = [...filedata];
							revoke(data.splice(i, 1));
							filedata = data;
						}}
					/>
					{#each imgUsingKeys as type}
						<label for="img_{i}_{type}_switch">
							<input
								type="checkbox"
								id="img_{i}_{type}_switch"
								role="switch"
								bind:checked={data.type[type]}
							/>
							{imgUsingDescribe[type]}
						</label>
					{/each}
					<span data-tooltip="在编辑文本时用此ID替代图片的地址">
						ID:<code>{data.localID}</code>
					</span>
				</fieldset>
				<div class="img" on:dragstart={(e) => dragstart(e, data.localID)} draggable>
					<img bind:this={data.element} src={data.localUrl} alt={data.file.name} />
				</div>
				{#if data.err}
					<input readonly class="error" value={data.err} aria-invalid={true} />
				{/if}
			</div>
		{/each}
	</div>
	<small class="describe">拖动图片到上方文本框即可插入图片</small>
{/if}
{#if dev}
	开发者数据(ImgUploader):
	<pre>{JSON.stringify(
			filedata.map((d, i) => ({ index: i, ...d, element: undefined, file: undefined })),
			null,
			4,
		)}</pre>
{/if}

<style>
	.img-view {
		border-radius: 10px;
		border: 1px solid var(--form-element-border-color);
		padding: 10px;
	}
	.img-view > div {
		--border-radius: 0.5rem;
		padding: 10px;
	}
	.img-view > div > fieldset {
		width: 100%;
		padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
		border: var(--border-width) solid var(--form-element-border-color);
		border-radius: 0;
		border-top-left-radius: var(--border-radius);
		border-top-right-radius: var(--border-radius);
		border-bottom: none;
		margin: 0;
	}
	.img-view > div > .img {
		cursor: grab;
		width: 100%;
		border: var(--border-width) solid var(--form-element-border-color);
		overflow: hidden;
	}
	.img-view > div > .img:last-child {
		border-bottom-left-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);
	}
	.img-view > div > .error {
		line-height: var(--line-height);
		border-top: none;
		border-radius: 0;
		border-bottom-left-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);
	}
	.img-view fieldset {
		position: relative;
	}
	.describe {
		display: block;
		width: 100%;
		margin-top: 0;
		margin-bottom: var(--spacing);
		color: var(--muted-color);
	}

	.close {
		cursor: pointer;
		display: block;
		width: 1rem;
		height: 1rem;
		position: absolute;
		right: 1rem;
		background-image: var(--icon-close);
		background-position: center;
		background-size: auto 1rem;
		background-repeat: no-repeat;
		opacity: 0.5;
		transition: opacity var(--transition);
	}
	.close.disabled {
		cursor: default;
		opacity: 0.3;
	}
	.close:hover:not(.disabled) {
		opacity: 1;
	}
</style>
