<script lang="ts">
	import Header from '$components/Header.svelte';
	import 'bootstrap/dist/css/bootstrap-grid.min.css';
	import '@picocss/pico/css/pico.min.css';

	import '../app.css';
</script>

<main>
	<Header />
	<slot />
</main>

<style>
	main {
		width: 100vw;
		overflow-y: auto;
	}
</style>
