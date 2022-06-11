<script lang="ts">
	export let value: number | undefined = undefined;
	export let max: number = 1;
	export let boxClass: string | undefined = '';
	export let barClass: string | undefined = '';
	export let floatTxt: boolean = false;
	export let txt = '';

	export let height: number = 20;
	export let color: string = '#337ab7';
</script>

<div class="box {boxClass || ''}" on:click style:height="{height}px" style:line-height="{height}px">
	<div
		class="bar {barClass || ''}"
		class:noVal={value === undefined}
		style:width="{value !== undefined ? (value / (max || 1)) * 100 : 100}%"
		style:background-color={color}
		style:background-size="{height}px {height}px"
		style:height="{height}px"
	>
		{#if floatTxt}<span class="float">{txt}</span>{/if}
	</div>
	{#if !floatTxt}
		<span>{txt}</span>
	{/if}
</div>

<style>
	@-webkit-keyframes progress-bar-stripes {
		0% {
			background-position-x: 1rem;
		}
	}

	@keyframes progress-bar-stripes {
		0% {
			background-position-x: 1rem;
		}
	}
	.bar.noVal {
		-webkit-animation: progress-bar-stripes 0.2s linear infinite;
		-o-animation: progress-bar-stripes 0.2s linear infinite;
		animation: progress-bar-stripes 0.2s linear infinite;
		background-image: -webkit-linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-image: -o-linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
		background-image: linear-gradient(
			45deg,
			rgba(255, 255, 255, 0.15) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.15) 50%,
			rgba(255, 255, 255, 0.15) 75%,
			transparent 75%,
			transparent
		);
	}
	span {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 2;
		color: #000;
		text-align: center;
		top: 0;
		left: 0;
	}
	span.float {
		color: #fff;
	}
	.box {
		width: 100%;
		min-width: 10px;
		font-size: 12px;
		overflow: hidden;
		background-color: #f1f1f1;
		border-radius: 8px;
		-webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		position: relative;
	}
	.bar {
		position: relative;
		float: left;
		width: 0;
		-webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
		box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
		-webkit-transition: width 0.6s ease;
		-o-transition: width 0.6s ease;
		transition: width 0.6s ease;
		overflow: visible;
	}
</style>
