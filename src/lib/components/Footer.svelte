<script lang="ts">
	const toggleDarkMode = () => {
		const darkMode_name = 'MCRESWEB-THEME';
		const darkMode_dark = 'dark';
		const darkMode_light = 'light';
		// data-theme="light"
		if (localStorage.getItem(darkMode_name) == darkMode_dark) {
			document.querySelector('html')!.setAttribute('data-theme', darkMode_light);
			localStorage.setItem(darkMode_name, darkMode_light);
		} else {
			document.querySelector('html')!.setAttribute('data-theme', darkMode_dark);
			localStorage.setItem(darkMode_name, darkMode_dark);
		}
	};
</script>

<div class="footer">
	<div class="container">
		<div class="row">
			<div class="headings col-12 col-md-6 col-xl-3">
				<h1 class="mrw">MRW</h1>
				<h2>会员制资源平台</h2>
			</div>
			<div class="col-12 col-md-3">
				<table>
					<thead><tr><th><b>关于我们</b></th></tr></thead>
					<tbody>
						<tr>
							<td>
								<a href="https://github.com/mcresweb/web" target="_blank">前端项目</a>
							</td>
						</tr>
						<tr>
							<td>
								<a href="https://github.com/mcresweb/Server2" target="_blank">后端项目</a>
							</td>
						</tr>
						<tr>
							<td>
								<a href="https://github.com/mcresweb" target="_blank">Github组织</a>
							</td>
						</tr>
						<tr>
							<td>
								<a href="/contact-us">联系我们</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="col-12 col-md-3">
				<table>
					<thead><tr><th><b>小工具</b></th></tr></thead>
					<tbody>
						<tr>
							<td>
								<a href="/tool/uuid">UUID生成</a>
							</td>
						</tr>
						<tr>
							<td>
								<a href="/tool/markdown">Markdown预览</a>
							</td>
						</tr>
						<tr>
							<td>
								<a href="/tool/bbcode">BBCode预览</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="col-12 col-md-3">
				<table>
					<thead><tr><th><b>杂项</b></th></tr></thead>
					<tbody>
						<tr>
							<td>
								<a href="/essay/random">随机内容</a>
							</td>
						</tr>
						<tr>
							<td>
								<span href="/essay/random" on:click={toggleDarkMode}>切换主题</span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

<style>
	.footer {
		--background-color: var(--primary);
		--background-color-dark: #18222b;
		padding: 20px 0;
		background-color: var(--background-color);
		width: 100vw;
		min-height: 200px;
	}

	@media only screen and (prefers-color-scheme: dark) {
		:global(*):not([data-theme='light']) .footer {
			--background-color: var(--background-color-dark);
		}
	}
	:global([data-theme='dark']) .footer {
		--background-color: var(--background-color-dark);
	}

	.footer,
	.footer * {
		color: var(--primary-inverse);
	}
	.mrw {
		letter-spacing: 0.7rem;
	}
	table a,
	table span {
		cursor: pointer;
		width: 100%;
		height: 100%;
		display: inline-block;
	}
	table a:hover,
	table span:hover {
		font-weight: bold;
	}
</style>
