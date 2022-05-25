<script lang="ts">
	import { browser } from '$app/env';
	import { getVaptchaID } from '$lib/api/user';

	//验证码
	//https://www.vaptcha.com/document/install.html

	let vobj: any;
	let promise = browser && getVaptchaID(fetch).then(build);

	/** 数据 */
	export let data: { server: string; token: string } | undefined = undefined;
	/**重置*/
	export const reset = async () => {
		await promise;
		vobj && vobj.reset();
	};
	/**验证*/
	export const validate = async () => {
		await promise;
		if (vobj) vobj.validate();
		else pass(undefined);
	};
	/**验证回调*/
	export let pass: (d: typeof data) => unknown;

	/** 构建验证码 */
	async function build(vid: string) {
		if (!vid) return;
		return (window as any)
			.vaptcha({
				vid,
				mode: 'invisible',
				scene: 0,
				area: 'auto',
			})
			.then(function (VAPTCHAObj: any) {
				vobj = VAPTCHAObj;

				// 验证成功进行后续操作

				VAPTCHAObj.listen('pass', function () {
					let serverToken = VAPTCHAObj.getServerToken();
					data = { server: serverToken.server, token: serverToken.token };
					pass(data);
				});
			});
	}
</script>

<svelte:head><script src="https://v-cn.vaptcha.com/v3.js"></script></svelte:head>
