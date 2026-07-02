import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { honoClient } from '$lib/server/hono';
import { resolve } from '$app/paths';

export const load: PageServerLoad = async (e) => {
	const code = e.url.searchParams.get('code');

	if (!code) {
		return error(400, 'Missing code');
	}

	const githubPostReq = await honoClient.api.v1.auth.github.$post({
		json: {
			code: code
		}
	});

	if (!githubPostReq.ok) {
		const b = await githubPostReq.json();
		console.error(b);
		if (githubPostReq.status == 401) {
			throw redirect(303, resolve('/auth'));
		}

		throw error(500);
	}

	const j = await githubPostReq.json();

	e.cookies.set('session', j.token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});

	return j;
};
