import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { resolve } from '$app/paths';
import { getAuthInfo } from '$lib/server/getUserInfo';

export const load: LayoutServerLoad = async (e) => {
	const authData = await getAuthInfo(e.cookies.get('session'));

	if (!authData) {
		throw redirect(301, resolve('/(home)/auth'));
	}
};
