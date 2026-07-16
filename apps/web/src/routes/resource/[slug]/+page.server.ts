import { apiClient } from '$lib/server/hono';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const resourceInfo = await apiClient.v1.resources[':locator'].$get({
		param: {
			locator: params.slug
		},
		query: {
			type: 'slug'
		}
	});

	if (!resourceInfo.ok) {
		if (resourceInfo.status == 404) {
			throw error(404, 'Not found');
		}
		throw error(500, 'Internal Error');
	}

	const d = await resourceInfo.json();
	return {
		resource: d
	};
};
