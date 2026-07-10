import { apiClient } from './hono';

export const getAuthInfo = async (session: string | undefined) => {
	if (!session) {
		return;
	}

	console.log(session);
	const data = await apiClient.v1.session.$get(
		{},
		{
			headers: {
				Authorization: `Bearer ${session}`
			}
		}
	);

	if (!data.ok) {
		console.log(await data.json());
		return false;
	}

	return await data.json();
};
