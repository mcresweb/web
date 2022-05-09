<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '../app.css';
</script>

<main>
	<slot />
</main>

<style>
	main {
		width: 100vw;
		height: 100vh;
		overflow-y: auto;
	}
</style>
