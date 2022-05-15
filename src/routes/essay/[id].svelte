<script context="module" lang="ts">
	import { getEssay } from '$lib/api/content';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, params }) => {
		const essay = await getEssay(fetch, parseInt(params.id));
		if (!essay) return { status: 404 };
		return {
			props: { essay },
		};
	};
</script>

<script lang="ts">
	import type { Essay } from '$defs/content';

	export let essay: Essay;
</script>

<pre>{JSON.stringify(essay, null, 4)}</pre>
