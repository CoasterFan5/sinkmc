import { apiClient } from '$lib/server/hono';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const versions = await apiClient.v1.resources[':resourceLocator'].versions.$get({
		param: {
			resourceLocator: params.slug
		}
	});

	if (!versions.ok) {
		throw error(500, 'error getting versions');
	}

	const versionData = versions.json();

	return {
		versions: versionData
	};
};
