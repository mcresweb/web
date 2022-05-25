<script lang="ts">
	import { browser } from '$app/env';
	import type { SetVaptchaRequest } from '$defs/user';
	import { getVaptchaID, setVaptchaID } from '$lib/api/user';

	let vid: string = '';
	let key: string = '';
	if (browser) getVaptchaID(fetch).then((str) => ((vid = str), (key = '')));

	const submit = async (type: keyof SetVaptchaRequest) => {
		if (type === 'key') {
			await setVaptchaID(fetch, { key });
			key = '';
		} else if (type === 'vid') {
			await setVaptchaID(fetch, { vid });
		} else throw new Error();
	};
</script>

<p>
	本平台内置了<i> VAPTCHA </i> 人机验证模块, 可以在登录、注册、验证邮箱等环节使用。
</p>
<p>
	如果需要启用验证模块, 需要先在
	<a href="https://www.vaptcha.com/" target="_blank">官网 https://www.vaptcha.com/</a> 中按照流程注册验证单元,
	并将验证单元的数据填写在下方
</p>

<label for="in-vid">
	VID
	<div class="row">
		<div class="col-8 col-md-9">
			<input
				type="text"
				id="in-vid"
				placeholder="请输入您的验证单元VID"
				bind:value={vid}
				autocomplete="off"
			/>
			<small>用于标识单元的ID, 无需保密</small>
		</div>
		<div class="col-4 col-md-3">
			<button on:click={() => submit('vid')}>设置</button>
		</div>
	</div>
</label>

<label for="in-key">
	Key
	<div class="row">
		<div class="col-8 col-md-9">
			<input
				type="text"
				id="in-key"
				placeholder="请输入您的验证单元KEY"
				bind:value={key}
				autocomplete="off"
			/>
			<small>用于后端验证的KEY, 严防泄露 —— 仅可设置, 不可查看</small>
		</div>
		<div class="col-4 col-md-3">
			<button on:click={() => submit('key')}>设置</button>
		</div>
	</div>
</label>
