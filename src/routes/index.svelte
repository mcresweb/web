<script lang="ts">
	import Header from '$components/Header.svelte';
	import { basic } from '$lib/api/info';
</script>

<div id="head" class="container">
	<article class="row">
		<div id="welcome" class="headings col-lg-8 ">
			<h1>Minecraft Resource Website</h1>
			<h2>
				网站简称 mrw 或 mcresweb<br />一个致力于为付费会员提供各类 Minecraft 优质资源的服务平台。
			</h2>
		</div>
		{#await basic(fetch)}
			<article aria-busy="true" class=" col-lg-4 " />
		{:then data}
			<article class=" col-lg-4 ">
				<table>
					<thead>
						<tr><th scope="col" colspan="2">平台信息</th></tr>
					</thead>
					<tbody>
						<tr><td>分类数量: </td><td><strong>{data.catalogue}</strong></td></tr>
						<tr><td>内容数量: </td><td><strong>{data.essay}</strong></td></tr>
						<tr><td>用户数量: </td><td><strong>{data.user}</strong></td></tr>
						<tr><td>建站天数: </td><td><strong>{data.day}</strong></td></tr>
					</tbody>
				</table>
			</article>
		{/await}
	</article>
</div>

<style>
	#head {
		padding-top: 50px;
	}
	#welcome h1 {
		--font-size: 2.5rem;
		/* background-color: cadetblue; */
	}
	tr > td:first-child {
		width: 40%;
	}
</style>
