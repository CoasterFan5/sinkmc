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

{#each data.resources as r (r.id)}
	<p>{r.name}</p>
{/each}
