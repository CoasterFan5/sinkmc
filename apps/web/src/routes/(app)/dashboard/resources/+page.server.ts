import { apiClient } from '$lib/server/hono';
import { createHeaders } from '$lib/server/manageHeader';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const resources = await apiClient.v1.resources.$get(
		{
			query: {
				ownerId: user.id
			}
		},
		{
			headers: createHeaders()
		}
	);

	if (!resources.ok) {
		throw error(500, 'error');
	}

	return await resources.json();
};
