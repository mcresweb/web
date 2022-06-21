<script lang="ts">
	export let label = '';
	export let labelClass = '';

	export let id = Math.random().toString(36).substring(2);
	export let name: string | undefined = undefined;
	export let type: string | undefined | null;
	export let placeholder: string | undefined | null = undefined;
	export let value: string | undefined | null;
	export let disabled = false;
	export let autocomplete: string | undefined | null = undefined;
	export let invalid: boolean | undefined = undefined;

	export let error: string | undefined | null = undefined;
	export let helpText: string | undefined = undefined;

	export let inputElement: HTMLElement | undefined = undefined;

	// See https://stackoverflow.com/a/57393751 why we don't just bind value
	const handleInput = (event: any) => {
		value = event.target.value;
	};
	$: if (value === undefined) value = '';
</script>

<label for={id} class={labelClass}>
	{label}
	<input
		{type}
		{id}
		{name}
		{placeholder}
		{disabled}
		{autocomplete}
		{value}
		on:change
		on:input={handleInput}
		aria-invalid={invalid}
		bind:this={inputElement}
	/>
	{#if error}
		<small class="error">{error}</small>
	{:else if helpText}
		<small class="help">{helpText}</small>
	{/if}
</label>

<style>
	small.error {
		color: var(--bs-red);
	}
</style>
