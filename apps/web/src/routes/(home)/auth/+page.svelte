<script lang="ts">
	import type { PageData } from './$types';

	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

<h2>Sign In!</h2>

<a rel="external" href={data.uris.github}>Github</a>

<style lang="scss">
	h2 {
		font-weight: 500;
		margin: 0;
	}
</style>
