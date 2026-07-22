<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		children,
		onclick,
		type = 'button'
	}: {
		children?: Snippet<[]>;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		type?: HTMLButtonElement['type'];
	} = $props();
</script>

<button {onclick} {type}>
	{@render children?.()}
</button>

<style>
	button {
		background: var(--accent);
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		color: var(--text);
		font-family: var(--font);
		font-size: 0.9rem;
		padding: 0.5rem;
		outline: none;
		transition: all 50ms ease;
		cursor: pointer;
		color: var(--text);

		&:hover {
			background: var(--accent-80);
		}
	}

	button::placeholder {
		color: var(--text-40);
	}
</style>
