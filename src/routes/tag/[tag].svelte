<script context="module" lang="ts">
</script>

<script lang="ts">
	import { page, session } from '$app/stores';
</script>

<svelte:head><title>{$page.params.tag} - {$session.title}</title></svelte:head>

<div class="container">
	<article>
		<h3>待完善</h3>
		<p>
			用于显示当前tag相关的essay或tag.
			<br />
			也可以修改为搜索功能, 与搜索名称、发布者等归为同一个页面
		</p>
	</article>
</div>
