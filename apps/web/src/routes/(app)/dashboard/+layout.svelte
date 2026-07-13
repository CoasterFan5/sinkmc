<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	import DashboardIcon from '~icons/heroicons/squares-2x2';
	import ResourcesIcon from '~icons/heroicons/cube';

	const {
		children
	}: {
		children: Snippet<[]>;
	} = $props();
</script>

{#snippet sidebarButton(options: {
	href: ReturnType<typeof resolve>;
	label: string;
	icon: typeof DashboardIcon;
})}
	{@const active = page.url.pathname === options.href}
	<a class="sidebarButton" href={options.href} class:active>
		<span class="icon">
			<options.icon />
		</span>
		<span class="label">{options.label}</span>
	</a>
{/snippet}

<div class="wrap">
	<div class="sidebar">
		{@render sidebarButton({
			href: resolve('/(app)/dashboard'),
			label: 'Dashboard',
			icon: DashboardIcon
		})}
		{@render sidebarButton({
			href: resolve('/(app)/dashboard/resources'),
			label: 'Resources',
			icon: ResourcesIcon
		})}
	</div>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		flex-direction: row;
		padding: 1rem;
		height: 100%;
	}

	.sidebar {
		border: 1px solid var(--border);
		padding: 0.5rem;
		min-width: 12rem;
		border-radius: 0.25rem;
	}

	.sidebarButton {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem;
		border-radius: 0.25rem;
		text-decoration: none;
		color: var(--color);
		transition: all 75ms ease;

		&:hover {
			background-color: var(--accent);
		}

		&.active {
			color: var(--primary);
			background: var(--primary-10);
		}
	}

	.sidebarButton .icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: inherit;
	}

	.sidebarButton .label {
		color: inherit;
	}

	.content {
		width: 100%;
		padding-left: 1rem;
	}
</style>
