import type { AppType } from '../../../../api/src/index.ts';
import { hc } from 'hono/client';

export const honoClient = hc<AppType>('http://localhost:8787/');
