<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	$effect(() => {
		if (data) {
			goto(resolve('/account'));
		}
	});

	let periods = $state('...');
	let periodCount = 3;
	onMount(() => {
		setInterval(() => {
			periodCount += 1;
			if (periodCount >= 4) {
				periodCount = 0;
			}
			periods = '.'.repeat(periodCount);
		}, 250);
	});
</script>

<p>Validating Account{periods}</p>
