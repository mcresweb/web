<script lang="ts">
	import type { BasicInfo } from '$defs/info';
	import { basic } from '$lib/api/info';
	import anime from 'animejs';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { delay } from '$helpers/delay';
	import { contentUrl, listCatalogue, listCategory } from '$lib/api/content';

	const names: Record<keyof BasicInfo, string> = {
		catalogue: '分类数量',
		essay: '内容数量',
		user: '用户数量',
		day: '建站天数',
	};
	const eles: HTMLElement[] = [];
	const keys = <T extends string>(obj: Record<T, any>) => Object.keys(obj) as T[];
	const animeData = (ele: HTMLElement) => {
		const data = parseFloat(ele.dataset.value || '0') || 0;
		const duration = Math.random() * 1500;
		anime({ targets: ele, innerHTML: [0, data], easing: 'linear', round: 1, duration });
	};
	$: if (eles) eles.forEach(animeData);

	const flyData = { y: 20, duration: 800, easing: quintOut };
</script>

{#await delay() then _}
	<div id="head" class="container" in:fly={{ ...flyData, y: 100 }}>
		<article class="row">
			<div id="welcome" class="headings col-lg-8 ">
				<h1>
					<span class="m">M</span>inecraft <span class="r">R</span>esource
					<span class="w">W</span>ebsite
				</h1>
				<br />
				<h2>
					网站简称 <i>MRW</i> 或 <i>mcresweb</i><br />一个致力于为付费会员提供各类 Minecraft
					优质资源的服务平台。
				</h2>
			</div>
			{#await basic(fetch)}
				<article aria-busy="true" class="col-lg-4" />
			{:then data}
				<article class="col-lg-4" in:fly={flyData}>
					<table>
						<thead>
							<tr><th scope="col" colspan="2">平台信息</th></tr>
						</thead>
						<tbody>
							{#each keys(data) as k, i}
								<tr>
									<td>{names[k]}: </td>
									<td>
										<strong bind:this={eles[i]} data-value={data[k]} />
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</article>
			{/await}
		</article>
		<div class="row" in:fly={flyData}>
			<h4>资源分类:</h4>
			<hr />
			{#await listCatalogue(fetch)}
				<span aria-busy />
			{:then catalogue}
				{#each catalogue as cata}
					<div class="col-md-6 resources" in:fly={flyData}>
						<table>
							<thead>
								<tr><th><a href={contentUrl(cata.key)}>{cata.title}</a></th></tr>
							</thead>
							<tbody>
								{#await listCategory(fetch, cata.key)}
									<span aria-busy />
								{:then category}
									{#if category}
										{#each category as cate}
											<tr in:fly={flyData}>
												<td>
													<a href={contentUrl(cata.key, cate.key)}>{cate.title}</a>
												</td>
											</tr>
										{/each}
									{/if}
								{/await}
							</tbody>
						</table>
					</div>
				{/each}
			{/await}
		</div>
	</div>
{/await}

<style>
	.resources th a {
		font-size: 1.2em;
		font-weight: bolder;
		color: var(--bs-orange);
		padding: 5px;
		border-bottom: 1px solid var(--primary);
	}
	.m {
		color: var(--bs-teal);
	}
	.r {
		color: var(--bs-orange);
	}
	.w {
		color: var(--bs-blue);
	}
	#welcome h1 span {
		font-size: 1.5em;
	}
	#head {
		height: calc(100vh - 62px);
		position: relative;
	}
	#head > article {
		margin-top: 5vh;
		box-shadow: 0px 0px 30px #efdfef;
		background-color: #fffaff;
	}
	#welcome h1 {
		--font-size: 2.5rem;
		font-size: 2rem;
	}
	tr > td:first-child {
		width: 40%;
	}
</style>
