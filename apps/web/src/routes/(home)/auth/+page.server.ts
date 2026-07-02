import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const githubUrl = new URL('https://github.com/login/oauth/authorize');
	githubUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
	githubUrl.searchParams.set('redirect_uri', env.GITHUB_REDIRECT_URI);
	githubUrl.searchParams.set('scope', 'user user:email');

	return {
		uris: {
			github: githubUrl.toString()
		}
	};
};
