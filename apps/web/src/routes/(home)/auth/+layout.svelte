<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<div class="wrap">
	<div class="formWrap">
		{@render children?.()}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		align-items: start;
		justify-content: center;
		height: 100%;
	}

	.formWrap {
		padding: 1rem;
		border: 1px solid var(--border);
		margin-top: 10vh;
		width: 100%;
		max-width: 20rem;
		border-radius: 0.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
