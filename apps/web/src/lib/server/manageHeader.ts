import { resolve } from '$app/paths';
import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const createHeaders = (extraHeaders?: Record<string, string>) => {
	const rq = getRequestEvent();
	const session = rq.cookies.get('session');

	if (!session) {
		throw redirect(303, resolve('/(home)/auth'));
	}

	return {
		Authorization: `Bearer ${session}`,
		...extraHeaders
	};
};
