<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import '@fontsource-variable/geist/wght.css';
	import PersonIcon from '~icons/heroicons/user-circle';
	import ExperimentalFlag from './ExperimentalFlag.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ExperimentalFlag />
<div class="wrap">
	<nav class="nav">
		<div class="left">
			<a href={resolve('/')} class="header"> Sink </a>
		</div>
		<div class="right">
			<a class="navButton" href={resolve('/browse')}>Browse</a>
			<div class="verticalLine"></div>
			<a class="navButton accountButton" href={resolve('/(app)/dashboard')}>
				<PersonIcon />
			</a>
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
		--border: #303030;
		--accent: #292929;
		--accent-80: color-mix(in srgb, var(--accent) 80%, transparent 20%);
		--text: #e7e7e7;
		--text-40: color-mix(in srgb, var(--text) 40%, transparent 60%);
		--primary: #ff8735;
		--primary-25: color-mix(in srgb, var(--primary) 25%, transparent 75%);
		--primary-10: color-mix(in srgb, var(--primary) 10%, transparent 90%);
	}

	:global(*) {
		box-sizing: border-box;
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
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
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
		border-bottom: 1px solid var(--border);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.right {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		height: 100%;
		position: relative;
	}

	.navButton {
		color: var(--font);
		text-decoration: none;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.accountButton {
		color: var(--font);
		text-decoration: none;
		padding: 0.25rem;
		border-radius: 0.25rem;
		font-size: 1rem;
	}

	.content {
		height: 100%;
	}

	.verticalLine {
		background-color: var(--border);
		width: 1px;
	}
</style>
