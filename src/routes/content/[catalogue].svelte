<script lang="ts">
	import { page } from '$app/stores';

	$: catalogue = $page.params.catalogue;
</script>

{catalogue}
