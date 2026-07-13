<script lang="ts">
	import type { PageData } from './$types';

	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

<div>
	<img src={data.user.pfpUrl} alt="Profile Avatar" />
</div>
