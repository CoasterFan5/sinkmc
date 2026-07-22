<script lang="ts">
	import type { PageData } from './$types';
	import { createSizeString } from './createSizeString';
	import CubeIcon from '~icons/heroicons/cube';

	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

{#await data.versions}
	Loading...
{:then versions}
	<div class="versions">
		{#each versions as v (v.id)}
			<div class="version">
				<h2 class="versionString">{v.versionString}</h2>
				<p class="desc">{v.description}</p>
				<div class="artifacts">
					{#each v.artifacts as artifact (artifact.id)}
						<a
							target="_blank"
							rel="external"
							class="artifact"
							href="{data.API_URL}v1/resources/{artifact.resourceId}/download?hash={artifact.hash}"
						>
							<div class="left">
								<CubeIcon />
								{artifact.name}
							</div>
							<div class="right">
								{createSizeString(artifact.fileSize)}
							</div>
						</a>
					{/each}
				</div>
			</div>
		{:else}
			<p>No listed versions :(</p>
		{/each}
	</div>
{/await}

<style lang="scss">
	.versions {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		width: 100%;
		gap: 0.5rem;
	}
	.version {
		background: var(--accent);
		width: 100%;
		border: 1px solid var(--border);
		padding: 0.25rem;
		border-radius: 0.25rem;

		.versionString {
			margin: 0;
		}

		p {
			margin: 0;
		}
	}

	.artifacts {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background: var(--background);

		.artifact {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			padding: 0.5rem;
			cursor: pointer;
			color: var(--color);
			text-decoration: none;

			.left {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				gap: 0.25rem;
			}

			&:hover {
				color: var(--primary);
			}
		}
	}
</style>
