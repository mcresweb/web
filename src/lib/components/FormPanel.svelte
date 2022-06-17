<div class="row">
	<div class="left col-12 col-md-6">
		<h1><slot name="title" /></h1>
		<slot name="info" />
	</div>
	<div class="right col-12 col-md-6">
		<div class="form">
			<slot name="form" />
		</div>
	</div>
</div>

<style>
	* {
		/* 初始化 */
		margin: 0;
		padding: 0;
	}

	.left {
		height: calc(100% - 40px);
		background-color: var(--card-background-color);
		position: relative;
		/* top: 20px; */
		padding-bottom: 50px;
	}
	.left h1 {
		font-size: 50px;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 4px;
		margin: 55px 40px 40px 40px;
	}
	.left :global(p) {
		color: #999;
		margin: 15px 40px;
	}
	.right {
		height: 100%;
		background-color: #474a59;
		color: #f1f1f1;
		position: relative;
		box-shadow: 0 0 40px 16px rgba(0, 0, 0, 0.2);
	}
	.form {
		margin: 40px;
		position: relative;
	}
	.form :global(label) {
		color: #c2c2c2;
		display: block;
		font-size: 14px;
		margin-bottom: 5px;
	}
	.form :global(input) {
		--line-height: 1.2;
		color: #f2f2f2;
	}
	.form :global(button) {
		--line-height: 1.2;
		padding: var(--form-element-spacing-vertical) var(--form-element-spacing-horizontal);
		margin-bottom: var(--spacing);
		margin-top: calc(var(--spacing) * 0.25);
		height: calc(
			1rem * var(--line-height) + var(--form-element-spacing-vertical) * 2 + var(--border-width) * 2
		);
	}
	.form :global(button#submit) {
		margin-top: 40px;
	}
</style>
