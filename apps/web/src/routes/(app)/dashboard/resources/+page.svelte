<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

<div class="toolbar">
	<h2>Resources (n)</h2>
	<div class="right">
		<a href={resolve('/(app)/dashboard/resources/new')} class="add">+ Add</a>
	</div>
</div>

<div class="resources">
	{#each data.resources as r (r.id)}
		<a
			href={resolve('/resource/[slug]', {
				slug: r.slug
			})}>{r.name}</a
		>
	{/each}
</div>

<style>
	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border);
	}

	.add {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem 0.5rem;
		background: var(--accent);
		border-radius: 0.25rem;
		border: 1px solid var(--border);
		color: var(--color);
		text-decoration: none;

		&:hover {
			color: var(--primary);
		}
	}

	.resources {
		display: flex;
		flex-direction: column;
	}
</style>
