import { env } from '$env/dynamic/private';
import type { AppType } from '../../../../api/src/index.ts';
import { hc } from 'hono/client';

export const apiClient = hc<AppType>(env.API_URL);
