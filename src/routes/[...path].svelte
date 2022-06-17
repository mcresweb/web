<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ params }) => {
		return {
			status: 404,
			error: new Error(`页面未找到: ${params.path}`),
		};
	};
</script>
