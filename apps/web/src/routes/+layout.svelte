<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import '@fontsource-variable/geist/wght.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="wrap">
	<nav class="nav">
		<div class="left">
			<a href={resolve('/')} class="header"> Sink </a>
		</div>
		<div class="right">
			<a class="navButton" href={resolve('/browse')}>Browse</a>
		</div>
	</nav>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	:global(:root) {
		--font: 'Geist Variable', sans-serif;
		--background: #1b1b1b;
		--accent: #3d3d3d;
		--text: #e7e7e7;
		--primary: #6a2c9d;
	}

	:global(body) {
		font-family: var(--font);
		background: var(--background);
		color: var(--text);
		margin: 0;
	}

	.wrap {
		height: 100vh;
		width: 100%;
	}

	.header {
		font-weight: 500;
		text-decoration: none;
		margin: 0;
		color: var(--text);
		font-size: 1.5rem;
	}

	.nav {
		padding: 1rem 5%;
		border-bottom: 1px solid var(--accent);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.navButton {
		color: var(--font);
		text-decoration: none;
		padding: 0.25rem;
	}

	.content {
		height: 100%;
	}
</style>
