<script lang="ts">
	import { onDestroy } from 'svelte';

	const isOpenClass = 'modal-is-open';
	const openingClass = 'modal-is-opening';
	const closingClass = 'modal-is-closing';
	const animationDuration = 400; // ms

	/** 是否打开 */
	export let open: boolean = false;
	/** 当前是否打开 */
	let open0: boolean = false;
	/** 是否正在执行动画 */
	let running: boolean = false;

	$: if (!running && open != open0) {
		if (open) openModal();
		else closeModal();
	}

	// Close modal
	const closeModal = () => {
		running = true;
		document.documentElement.classList.add(closingClass);
		setTimeout(() => {
			document.documentElement.classList.remove(closingClass, isOpenClass);
			open0 = false;
			running = false;
		}, animationDuration);
	};
	// Open modal
	const openModal = () => {
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

<dialog bind:this={me} {open} on:click={click}>
	<article>
		<span style:cursor="opinter" aria-label="Close" class="close" on:click={() => (open = false)} />
		<slot />
	</article>
</dialog>
