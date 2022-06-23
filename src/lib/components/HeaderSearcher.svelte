<script lang="ts">
	import { goto } from '$app/navigation';

	import { listCatalogue, listCategory } from '$lib/api/content';

	export let show = true;

	/**处理搜索面板点击事件*/
	const handleSearchClick = (e: any) => {
		let target: HTMLElement | null = e.target;
		while (target) {
			if (target.classList.contains('box')) return;
			target = target.parentElement;
		}
		show = false;
	};
	/**搜索：指定大分类*/
	let cata = '';
	/**搜索：指定小分类*/
	let cate = '';
	/**搜索：指定用户*/
	let user = '';
	/**搜索：指定搜索内容*/
	let text = '';

	let searching = false;
	const keydown = (e: KeyboardEvent) => {
		if (!text || searching || e.key !== 'Enter') return;
		searching = true;
		let data: any = { t: text, catalogue: cata, category: cate, user: user, r: Math.random() };
		let urlParam = [];
		for (const key in data) if (data[key]) urlParam.push(`${key}=${encodeURIComponent(data[key])}`);
		goto(`/search/essay?${urlParam.join('&')}`).then(() => {
			show = false;
			searching = false;
		});
	};
</script>

<div on:click={() => (show = false)} class="search-bg" class:active={show} />
<div on:click={(e) => handleSearchClick(e)} class="search" class:active={show}>
	<div class="container">
		{#if show}
			<article class="box">
				<div class="grid">
					{#await listCatalogue(fetch)}
						<label>
							大分类
							<select bind:value={cata} disabled={searching}>
								<option value="" selected>-</option>
							</select>
						</label>
					{:then catalogues}
						<label>
							大分类
							<select bind:value={cata} disabled={searching}>
								<option value="" selected>-</option>
								{#each catalogues as catalogue}
									<option value={catalogue.key}>{catalogue.title}</option>
								{/each}
							</select>
						</label>
					{/await}
					{#await cata && listCategory(fetch, cata)}
						<label>
							小分类
							<select bind:value={cate} disabled={searching}>
								<option value="" selected>-</option>
							</select>
						</label>
					{:then categorys}
						{#if cata && categorys}
							<label>
								小分类
								<select bind:value={cate} disabled={searching}>
									<option value="" selected>-</option>
									{#each categorys as category}
										<option value={category.key}>{category.title}</option>
									{/each}
								</select>
							</label>
						{:else}
							<label>
								小分类
								<select bind:value={cate} disabled={searching}>
									<option value="" selected>-</option>
								</select>
							</label>
						{/if}
					{/await}

					<label>
						发布者
						<input type="text" bind:value={user} placeholder="ID / 名称" disabled={searching} />
					</label>
				</div>
				<input
					type="search"
					bind:value={text}
					on:keydown={keydown}
					placeholder="搜索内容"
					disabled={searching}
				/>
				{#if searching}
					<span aria-busy="true">Please wait…</span>
				{/if}
			</article>
		{/if}
	</div>
</div>

<style>
	div.search > div {
		transition: height 0.2s;
		height: 0;
	}
	div.search {
		left: 0;
		width: 100%;
		position: fixed;
		z-index: 10;
		height: 0;
		overflow: hidden;
	}
	div.search.active,
	div.search.active > div {
		height: 100vh;
	}
	div.search-bg {
		top: var(--header-height);
		left: 0;
		z-index: 9;
		background-color: #000;
		width: 100%;
		position: fixed;
		height: 0;
		overflow: hidden;
		opacity: 0;
		transition: opacity 0.2s;
	}
	div.search-bg.active {
		opacity: 0.5;
		height: calc(100vh - var(--header-height));
	}
</style>
