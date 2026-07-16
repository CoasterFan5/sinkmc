import { apiClient } from '$lib/server/hono';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const resources = await apiClient.v1.resources.$get({
		query: {}
	});

	return await resources.json();
};
