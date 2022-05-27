<script lang="ts">
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
	import 'bootstrap/dist/css/bootstrap-grid.min.css';
	import '@picocss/pico/css/pico.min.css';

	import '../app.css';
</script>

<main>
	<Header />
	<div>
		<slot />
	</div>
	<Footer />
</main>

<style>
	main {
		--header-height: 62px;
		width: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}
	div {
		width: 100%;
		min-height: calc(100vh - var(--header-height));
	}
</style>
