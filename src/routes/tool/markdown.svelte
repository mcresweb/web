<script lang="ts">
	import { marked } from 'marked';

	let value: string;
</script>

<div class="main row">
	<div class="col-6">
		<textarea bind:value />
	</div>
	<div class="col-6">
		{@html value ? marked(value) : ''}
	</div>
	<div class="col-6">
		{value ? marked(value) : ''}
	</div>
	<div class="col-6"><pre>{JSON.stringify(value)}</pre></div>
</div>

<style>
	textarea {
		resize: vertical;
		min-height: 200px;
	}
	.main {
		width: 100vw;
		overflow-x: hidden;
	}
	pre {
		white-space: pre-wrap;
	}
</style>
