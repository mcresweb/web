<script context="module" lang="ts">
	import {
		doAdminRegister,
		doLogin,
		doRegister,
		getMe,
		getSalt,
		sendEmailCheckCode,
		summonInitCode,
	} from '$lib/api/user';
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
	import Dialog from '$components/Dialog.svelte';
	import InputBase from '$components/InputBase.svelte';
	import { onMount } from 'svelte';

	export let regInfo: RegisterInfo;

	const types = ['login', 'register'] as const;
	type Type = typeof types[number];

	let hash = ($page.url.hash || '').substring(1) as any;
	let type: Type = types.indexOf(hash) < 0 ? 'login' : hash;
	$: type = types.indexOf(hash) < 0 ? 'login' : hash;

	if (browser && types.indexOf(location.hash.substring(1) as any) < 0) location.hash = types[0];

	/**是否是初始化页面*/
	const isInit = $page.url.search === '?init';
	/**初始化验证码请求面板打开状态*/
	let openInitCodeResp = false;
	let initCodePath: string;

	/** 重置验证码 */
	let reset: () => Promise<void>;
	/** 验证验证码 */
	let validate: () => Promise<void>;

	let username: string;
	let password: string;
	let email: string;
	let emailCode: string;
	let check_password: string;
	let initCode: string;

	$: updateInputCheck(username, 'account');
	$: updateInputCheck(email, 'email');
	$: updateInputCheck(emailCode, 'emailCode');
	$: updateInputCheck(password, 'password');
	$: updateInputCheck(check_password, 'checkPassword', password);
	$: updateInputCheck(initCode, 'initCode');

	/** 本地基础验证 */
	let badData = false;
	let error: string;
	$: badData = Object.values(inputErrors).some((x) => x !== undefined) || !!error;

	const login = async () => {
		if (badData) return;

		const salt = await getSalt(fetch);

		try {
			let resp: LoginResp | RegisterResp;
			if (type === types[0]) {
				const pwd = hashString(hashString(password, salt.salt), salt.time);
				resp = await doLogin(fetch, { username, password: pwd, time: salt.time });
			} else if (isInit) {
				const pwd = hashString(password, salt.salt);
				resp = await doAdminRegister(fetch, initCode, {
					username,
					password: pwd,
					email,
					code: emailCode,
				});
			} else {
				const pwd = hashString(password, salt.salt);
				resp = await doRegister(fetch, { username, password: pwd, email, code: emailCode });
			}
			if (resp.success) return goto('./');
			else {
				error = resp.err;
			}
		} finally {
			reset();
		}
	};

	/**获取字符串摘要*/
	const hashString = (a: string, b: string) => {
		return `${(window as any).CryptoJS.SHA256(a + b)}`;
	};

	/**所有的输入字段*/
	type inputFields = 'account' | 'email' | 'emailCode' | 'password' | 'checkPassword' | 'initCode';
	/**输入字段的元素*/
	const inputElements: { [k in inputFields]?: HTMLElement } = {};
	/**输入字段的错误, null: 无输入, undefined: 无错误, string: 错误信息 */
	const inputErrors: { [k in inputFields]?: string | null } = {};
	/**输入限制*/
	const inputLimit: {
		[k in inputFields]?: {
			/**判断输入是否为空(即不提示有效/无效, 也不进行后续判断)*/
			empty?: (input: string) => boolean;
			/**输入数据限制*/
			limit: {
				/**当无效时的提示信息*/
				txt: string;
				/**
				 * 判断输入内容是否无效
				 * @param input 输入内容
				 * @returns is invalid
				 */
				func: (input: string) => boolean;
			}[];
		};
	} = {
		account: {
			limit: [
				{ txt: '名称过长', func: (str) => str.length > regInfo.nameLen },
				{ txt: '不得含@符号', func: (str) => type === types[1] && str.indexOf('@') >= 0 },
				{ txt: '不得为纯数字', func: (str) => type === types[1] && /^[0-9]+$/.test(str) },
			],
		},
		email: {
			limit: [
				{
					txt: '无效邮箱',
					func: (str) => !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(str),
				},
			],
		},
		emailCode: {
			limit: [
				{ txt: `非数字`, func: (str) => !/^[0-9]+$/.test(str) },
				{ txt: `长度不足 ${emailCodeLength} 位`, func: (str) => str.length != emailCodeLength },
			],
		},
		password: {
			limit: [
				{ txt: '密码过短', func: (str) => str.length < minPwdLen },
				{
					txt: '不得仅含 数字+小写字母 或 数字+大写字母 ',
					func: (str) => /^[0-9a-z]+$/.test(str) || /^[0-9A-Z]+$/.test(str),
				},
			],
		},
		checkPassword: {
			limit: [
				{ txt: '两次密码不一致', func: (str) => str != password },
				{ txt: '原密码有误', func: () => !!inputErrors.password },
			],
		},
	};
	/**
	 * 更新输入检查
	 * @param input 输入内容
	 * @param type 对应字段
	 * @param _justListen 用于监听的字段
	 */
	const updateInputCheck = (input: string, type: inputFields, ..._justListen: any[]) => {
		_justListen;
		error = ''; //清除全局错误
		const attr = 'aria-invalid';
		const ele = inputElements[type];
		if (!ele) return;
		const limit = inputLimit[type];
		if (!limit || (limit.empty ? limit.empty : (str: string) => !str)(input)) {
			ele.removeAttribute(attr);
			inputErrors[type] = null;
		} else {
			const bad = limit.limit.find((x) => x.func(input));
			ele.setAttribute(attr, !!bad + '');
			inputErrors[type] = bad?.txt;
		}
	};

	/**
	 * 邮箱验证码冷却
	 * 字符串: 错误消息, 正数: 冷却秒数, 0: 无, -1: 发送中
	 */
	let emailCodeCooling: number | string = 0;
	onMount(() => {
		const task = setInterval(() => {
			if (typeof emailCodeCooling === 'number' && emailCodeCooling > 0) emailCodeCooling--;
		}, 1000);
		return () => clearInterval(task);
	});
	const getEmailCode = async () => {
		emailCodeCooling = -1;
		const resp = await sendEmailCheckCode(fetch, email);
		if (typeof resp === 'string') emailCodeCooling = resp;
		else if (resp) emailCodeCooling = 60;
		else emailCodeCooling = '内部错误';
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
				{:else if isInit}
					<p><b>想要初始化服务器, 你需要建立一个管理员账号</b></p>
					<p>
						注册管理员账号需要验证后端权限, 且只能在没有任何管理员存在时注册,
						如果您不想注册管理员账户, 请 <span
							role="link"
							on:click={() => {
								history.replaceState(null, '', $page.url.pathname);
								location.reload();
							}}>点我进行登录</span
						>
					</p>
				{:else}
					<p>欢迎光临, 想要自由地探索 <i>{$session.title}</i> , 您首先需要注册一个账号。</p>
					<p>已经有账号了? <a href="#{types[0]}">点我进行登录</a></p>
				{/if}
			</span>
			<span slot="form">
				<InputBase
					label="账号"
					id="account"
					type="text"
					placeholder="用户名{type === types[0] ? ' / ID / 邮箱' : ''}"
					bind:value={username}
					autocomplete="username"
					bind:inputElement={inputElements.account}
					error={inputErrors.account}
				/>

				{#if type === types[1]}
					<InputBase
						label="邮箱"
						id="email"
						type="email"
						placeholder="请输入您的邮箱"
						bind:value={email}
						autocomplete="email"
						bind:inputElement={inputElements.email}
						error={inputErrors.email}
					/>

					<div class="row">
						<InputBase
							label="邮箱验证码"
							labelClass="col-7"
							id="emailCode"
							type="text"
							placeholder="请输入您的验证码"
							bind:value={emailCode}
							bind:inputElement={inputElements.emailCode}
							error={typeof emailCodeCooling === 'string'
								? emailCodeCooling
								: inputErrors.emailCode}
						/>
						<label for="getEmailCode" class="col-5">
							获取验证码
							<button
								id="getEmailCode"
								aria-busy={emailCodeCooling == -1 ? true : undefined}
								disabled={inputErrors.email !== undefined ||
									(typeof emailCodeCooling === 'number' && emailCodeCooling !== 0)}
								on:click={getEmailCode}
							>
								获取{#if typeof emailCodeCooling === 'number' && emailCodeCooling > 0}&nbsp;({emailCodeCooling}){/if}
							</button>
						</label>
					</div>
				{/if}
				<InputBase
					label="密码"
					type="password"
					id="password"
					placeholder="请输入您的密码"
					bind:value={password}
					autocomplete={type === types[1] ? 'new-password' : 'current-password'}
					bind:inputElement={inputElements.password}
					error={inputErrors.password}
				/>
				{#if type === types[1]}
					<InputBase
						label="确认密码"
						type="password"
						id="check-password"
						placeholder="请再次输入您的密码"
						autocomplete="new-password"
						bind:value={check_password}
						bind:inputElement={inputElements.checkPassword}
						error={inputErrors.checkPassword}
					/>
				{/if}
				{#if error}
					<span style:color="var(--bs-red)">
						{error}
					</span>
				{/if}
				{#if isInit}
					<div class="row">
						<InputBase
							label="后台权限验证码"
							labelClass="col-7"
							id="initCode"
							type="text"
							placeholder="请输入您的权限码"
							bind:value={initCode}
							bind:inputElement={inputElements.initCode}
							error={inputErrors.initCode}
						/>
						<label for="getInitCode" class="col-5">
							获取验证码
							<button
								id="getInitCode"
								on:click={async () => {
									initCodePath = await summonInitCode(fetch);
									openInitCodeResp = true;
								}}
							>
								获取
							</button>
						</label>
					</div>
				{/if}
				<button id="submit" on:click={validate} disabled={badData}>
					{#if type === types[0]} 登录 {:else if isInit} 注册管理员 {:else} 注册 {/if}
				</button>
			</span>
		</FormPanel>
	</article>

	<Dialog bind:open={openInitCodeResp}>
		<h1>后台权限验证码</h1>
		<p>
			此验证码用于验证你是否真的拥有后台权限, 我们在以下目录生成了一个包含验证码的文件, 请你打开它,
			并将其输入到对应位置
		</p>
		<p>请注意：每次你点击"获取"按钮时都会生成一个新的验证码，请不要重复点击。</p>
		<blockquote>{initCodePath}</blockquote>
	</Dialog>

	<Vaptcha bind:reset bind:validate pass={login} />
</div>
