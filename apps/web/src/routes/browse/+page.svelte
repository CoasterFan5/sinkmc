<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	export const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

{#each data.resources as r (r.id)}
	<a
		href={resolve('/resource/[slug]', {
			slug: r.slug
		})}>{r.name}</a
	>
{/each}
