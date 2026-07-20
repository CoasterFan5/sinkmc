<script lang="ts">
	import type { PageData } from './$types';

	import DownloadIcon from '~icons/heroicons/arrow-down-tray';
	import StarIcon from '~icons/heroicons/star';
	import UpdateIcon from '~icons/heroicons/arrow-path';
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';

	const {
		data,
		children
	}: {
		data: PageData;
		children: Snippet<[]>;
	} = $props();
</script>

<div class="wrap">
	<div class="topBanner">
		<h2>{data.resource.name}</h2>
		{data.resource.description}
		<div class="stats">
			<div class="stat downloads">
				<DownloadIcon /> 10k
			</div>
			<div class="stat rating">
				<StarIcon /> 4.3
			</div>
			<div class="stat lastUpdate">
				<UpdateIcon /> 1 Day Ago
			</div>
		</div>
	</div>
	<div class="nav">
		<a
			href={resolve('/resource/[slug]', {
				slug: data.resource.slug
			})}>Overview</a
		>
		<a
			href={resolve('/resource/[slug]/versions', {
				slug: data.resource.slug
			})}>Versions</a
		>
	</div>
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		height: 100%;
	}

	.topBanner {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid var(--border);

		h2 {
			font-weight: 500;
			margin: 0;
		}

		.stats {
			display: flex;
			flex-direction: row;
			gap: 1rem;
			padding: 0.25rem 0;

			.stat {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				gap: 0.25rem;
			}
		}
	}
</style>
