<script lang="ts">
	import { onDestroy } from 'svelte';

	const isOpenClass = 'modal-is-open';
	const openingClass = 'modal-is-opening';
	const closingClass = 'modal-is-closing';
	const animationDuration = 400; // ms

	/**指定是否需要最小区域(50%*50%)撑开内容*/
	export let minHeight = false;

	/**
	 * 是否打开
	 *
	 * 布尔值代表有动画, 数字值代表无动画
	 *
	 * `true` / `1`: 打开, `false` / `0`: 关闭
	 *  */
	export let open: boolean | 1 | 0 = false;
	/** 当前是否打开 */
	let open0: boolean = false;
	/** 是否正在执行动画 */
	let running: boolean = false;

	$: if (!running && !!open != open0) {
		if (open) openModal(open !== 1);
		else closeModal(open !== 0);
	}

	// Close modal
	const closeModal = (animation: boolean) => {
		if (!animation) {
			open0 = open = false;
			return;
		}
		running = true;
		document.documentElement.classList.add(closingClass);
		setTimeout(() => {
			document.documentElement.classList.remove(closingClass, isOpenClass);
			open0 = false;
			running = false;
		}, animationDuration);
	};
	// Open modal
	const openModal = (animation: boolean) => {
		if (!animation) {
			open0 = open = true;
			return;
		}
		running = true;
		document.documentElement.classList.add(isOpenClass, openingClass);
		setTimeout(() => {
			document.documentElement.classList.remove(openingClass);
			running = false;
		}, animationDuration);
		open0 = true;
	};

	const click = (e: MouseEvent) => {
		const article = me && me.querySelector('article');
		if (article && article.contains(e.target as any)) return;
		open = false;
	};

	onDestroy(() => {
		open0 = open = false;
		document.documentElement.classList.remove(closingClass, isOpenClass, openingClass);
	});

	let me: HTMLElement;
</script>

<dialog bind:this={me} open={!!open} on:click={click}>
	<article class:minHeight>
		<span style:cursor="opinter" aria-label="Close" class="close" on:click={() => (open = false)} />
		<slot />
	</article>
</dialog>

<style>
	article {
		position: relative;
		min-width: 50vw;
	}
	article.minHeight {
		min-height: 50vh;
	}
</style>
