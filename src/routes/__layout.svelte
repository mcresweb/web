<script lang="ts">
	import Icon from '$components/Icon.svelte';
	import '@picocss/pico/css/pico.min.css';
	import '../app.css';
</script>

<header>
	<nav>
		<ul>
			<li><Icon icon="yonghu" /><strong>Brand</strong></li>
		</ul>
		<ul>
			<li><a href="#a">Link</a></li>
			<li><a href="#b">Link</a></li>
			<li><a href="#c" role="button">Button</a></li>
		</ul>
	</nav>
</header>

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
