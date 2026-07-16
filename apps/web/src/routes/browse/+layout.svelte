<script lang="ts">
	import type { Snippet } from 'svelte';
	import DropDownIcon from '~icons/heroicons/chevron-down';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

<div class="wrap">
	<div class="sidebar">
		<button class="categoryToggle">
			<span class="label">Categories</span>
			<span class="icon"><DropDownIcon /></span>
		</button>
	</div>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style>
	.wrap {
		height: 100%;
		padding: 1rem;
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
	}

	.sidebar {
		min-width: 15rem;
		height: 100%;
		border-radius: 0.25rem;
		border: 1px solid var(--border);
		padding: 1rem;
		box-sizing: border-box;
	}

	.content {
		width: 100%;
	}

	.categoryToggle {
		all: unset;
		font-size: 1rem;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.label {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.8rem;
		}
	}
</style>
