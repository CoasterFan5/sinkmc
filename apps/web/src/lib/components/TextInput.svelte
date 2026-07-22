<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		label,
		name,
		placeholder = '',
		value = $bindable(''),
		onchange,
		oninput,
		issues
	}: {
		label: string;
		name: string;
		placeholder?: string;
		value?: string;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		oninput?: ChangeEventHandler<HTMLInputElement>;
		issues?: RemoteFormIssue[] | undefined;
	} = $props();
</script>

<div class="wrap">
	<label for={name}>{label}</label>
	<input id={name} {name} {placeholder} bind:value {onchange} {oninput} />
	{#if issues}
		{@const issue = issues[0]}
		<div class="errorMessage">
			{issue.message}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		font-size: 0.875rem;
		opacity: 1;
		color: var(--text);
	}

	input {
		background: var(--accent);
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		color: var(--text);
		font-family: var(--font);
		font-size: 0.9rem;
		padding: 0.5rem;
		outline: none;
		transition: all 50ms ease;
	}

	input::placeholder {
		color: color-mix(in srgb, var(--text) 40%, transparent 60%);
	}

	input:focus {
		border-color: var(--primary);
	}

	.errorMessage {
		color: red;
	}
</style>
