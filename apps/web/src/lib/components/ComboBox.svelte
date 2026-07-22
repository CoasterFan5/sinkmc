<script lang="ts">
	import type { RemoteFormIssue } from '@sveltejs/kit';
	import type { ChangeEventHandler, MouseEventHandler } from 'svelte/elements';

	let {
		label,
		name,
		placeholder = '',
		items,
		value = $bindable(''),
		onchange,
		oninput,
		issues
	}: {
		label: string;
		name: string;
		placeholder?: string;
		items: [display: string, value: string][];
		value?: string;
		onchange?: ChangeEventHandler<HTMLInputElement>;
		oninput?: ChangeEventHandler<HTMLInputElement>;
		issues?: RemoteFormIssue[] | undefined;
	} = $props();

	let open = $state(false);
	let query = $state('');

	const openMenu = () => {
		open = true;
		query = '';
	};

	const closeMenu = () => {
		open = false;
	};

	let wrapDiv: HTMLDivElement | undefined = $state(undefined);

	const windowClickHandler: MouseEventHandler<Window> = (e) => {
		if (wrapDiv) {
			if (!e.composedPath().includes(wrapDiv)) {
				closeMenu();
			}
		}
	};
</script>

<svelte:window onclick={windowClickHandler} />

<div class="wrap" bind:this={wrapDiv}>
	<label for={name}>{label}</label>
	<input
		id={name}
		{name}
		{placeholder}
		{onchange}
		bind:value={query}
		{oninput}
		onfocus={openMenu}
	/>
	{#if open}
		<div class="options">
			{#each items as item (item[0])}
				{#if item[0].toLowerCase().includes(query.toLowerCase()) || item[1]
						.toLowerCase()
						.includes(query.toLowerCase())}
					<button
						type="button"
						class="option"
						onclick={() => {
							value = item[0];
							query = value;
							closeMenu();
						}}
					>
						{item[1]}
					</button>
				{/if}
			{/each}
		</div>
	{/if}
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
		position: relative;
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

	.options {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 100%;
		padding: 0.25rem;
		border: 1px solid var(--border);
		background: var(--accent);
		width: 100%;

		.option {
			width: 100%;
			display: flex;
			align-items: center;
			background: var(--accent);
			border-radius: 0.25rem;
			box-sizing: border-box;
			padding: 0.25rem 0.5rem;
			color: var(--color);
			border: 0px;
			font-size: 1rem;
			outline: 0px;

			&:hover {
				background: var(--background);
			}
		}
	}

	.errorMessage {
		color: red;
	}
</style>
