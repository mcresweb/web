<script context="module" lang="ts">
	import { doLogin, doRegister, getMe, getSalt } from '$lib/api/user';
	import { register as getRegisterInfo } from '$lib/api/info';
	import { browser } from '$app/env';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		if (!browser) return {};
		const user = await getMe(fetch);
		if (user.login) return { status: 302, redirect: './' };

		const regInfo = await getRegisterInfo(fetch);

		return { props: { regInfo } };
	};

	/** 邮件验证码长度 */
	const emailCodeLength = 6;
	/** 密码最小长度 */
	const minPwdLen = 6;
</script>

<script lang="ts">
	import { page, session } from '$app/stores';
	import FormPanel from '$components/FormPanel.svelte';
	import Vaptcha from '$components/VAPTCHA.svelte';
	import { goto } from '$app/navigation';
	import type { LoginResp, RegisterResp } from '$defs/user';
	import type { RegisterInfo } from '$defs/info';

	export let regInfo: RegisterInfo;

	const types = ['login', 'register'] as const;
	type Type = typeof types[number];

	let hash = ($page.url.hash || '').substring(1) as any;
	let type: Type = types.indexOf(hash) < 0 ? 'login' : hash;
	$: type = types.indexOf(hash) < 0 ? 'login' : hash;

	if (browser && types.indexOf(location.hash as any) < 0) location.hash = types[0];

	/** 重置验证码 */
	let reset: () => Promise<void>;
	/** 验证验证码 */
	let validate: () => Promise<void>;

	let username: string;
	let password: string;
	let email: string;
	let emailCode: string;
	let check_password: string;

	/** 本地基础验证 */
	let badData = false;
	let error: string;
	$: badData =
		!(username && isPassword(password)) ||
		(type === types[1] &&
			!(
				isUsername(username) &&
				check_password === password &&
				isEmail(email) &&
				emailCode &&
				emailCode.length === emailCodeLength
			));

	const login = async () => {
		if (badData) return;

		const salt = await getSalt(fetch);

		try {
			let resp: LoginResp | RegisterResp;
			if (type === types[0]) {
				const pwd = hashString(hashString(password, salt.salt), salt.time);
				resp = await doLogin(fetch, { username, password: pwd, time: salt.time });
			} else {
				const pwd = hashString(password, salt.salt);
				resp = await doRegister(fetch, { username, password: pwd, email, code: emailCode });
			}
			if (resp.success) return goto('./');
			else {
				error = resp.err;
				badData = true;
			}
		} finally {
			reset();
		}
	};

	/**获取字符串摘要*/
	const hashString = (a: string, b: string) => {
		return `${(window as any).CryptoJS.SHA256(a + b)}`;
	};

	const isEmail = (str: string): boolean =>
		str ? /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str) : false;
	const isUsername = (str: string): boolean => {
		if (!str || str.length > regInfo.nameLen) return false; //不得过长
		if (str.indexOf('@') >= 0) return false; //不得与邮箱重叠
		if (/^[0-9]+$/.test(str)) return false; //不得与用户ID重叠
		return true;
	};
	const isPassword = (str: string): boolean => {
		if (!str || str.length < minPwdLen) return false; //不可过短
		if (/^[0-9]+$/.test(str) || /^[0-9A-Z]+$/.test(str)) return false; //不可简单密码
		return true;
	};
</script>

<svelte:head>
	<title>登录 - {$session.title}</title>
	<script src="/sha256.js"></script>
</svelte:head>
<svelte:window on:hashchange={() => (hash = ($page.url.hash || '').substring(1))} />

<div class="container">
	<article>
		<FormPanel>
			<span slot="title">
				{type}
			</span>
			<span slot="info">
				{#if type === types[0]}
					<p>欢迎光临, 请登录 <b>{$session.title}</b> , 登录后您将可以自由地探索整个网站.</p>
					<p>还没有账号? <a href="#{types[1]}">点我进行注册</a></p>
					<p>忘记密码了? <a href="/user/forget-pwd">点我找回密码</a></p>
				{:else}
					<p>欢迎光临, 想要自由地探索 <i>{$session.title}</i> , 您首先需要注册一个账号。</p>
					<p>已经有账号了? <a href="#{types[0]}">点我进行登录</a></p>
					<p>
						一些信息限制:
						<br />
						账号最大长度: {regInfo.nameLen}, 不得纯数字, 不得含@
						<br />
						密码最小长度: {minPwdLen}, 不得仅含数字+小写字符/数字+大写字符, 需要同时包含大小写 /
						包含特殊字符等。
					</p>
				{/if}
			</span>
			<span slot="form">
				<label for="account">
					账号
					<input
						type="text"
						id="account"
						placeholder="用户名{type === types[0] ? ' / ID / 邮箱' : ''}"
						autocomplete="username"
						bind:value={username}
						aria-invalid={username ? type !== types[0] && !isUsername(username) : undefined}
					/>
				</label>

				{#if type === types[1]}
					<label for="email">
						邮箱
						<input
							type="email"
							id="email"
							placeholder="请输入您的邮箱"
							autocomplete="email"
							bind:value={email}
							aria-invalid={email ? !isEmail(email) : undefined}
						/>
					</label>

					<div class="row">
						<label for="emailCode" class="col-7">
							邮箱验证码
							<input
								type="text"
								id="emailCode"
								placeholder="请输入您的邮箱"
								autocomplete="email"
								bind:value={emailCode}
								aria-invalid={(emailCode && emailCode.length !== emailCodeLength) || undefined}
							/>
						</label>
						<label for="getEmailCode" class="col-5">
							获取验证码
							<button id="getEmailCode" disabled={!isEmail(email)} on:click={() => alert('?')}>
								获取
							</button>
						</label>
					</div>
				{/if}
				<label for="password">
					密码
					<input
						type="password"
						id="password"
						placeholder="请输入您的密码"
						autocomplete={type === types[1] ? 'new-password' : 'current-password'}
						bind:value={password}
						aria-invalid={password ? !isPassword(password) : undefined}
					/>
				</label>
				{#if type === types[1]}
					<label for="check-password">
						确认密码
						<input
							type="password"
							id="check-password"
							placeholder="请再次输入您的密码"
							autocomplete="new-password"
							bind:value={check_password}
							aria-invalid={check_password
								? check_password !== password || !isPassword(check_password)
								: undefined}
						/>
					</label>
				{/if}
				{#if error}
					<span style:color="var(--bs-red)">
						{error}
					</span>
				{/if}
				<button id="submit" on:click={validate} disabled={badData}>
					{#if type === types[0]} 登录 {:else} 注册 {/if}
				</button>
			</span>
		</FormPanel>
	</article>

	<Vaptcha bind:reset bind:validate pass={login} />
</div>
