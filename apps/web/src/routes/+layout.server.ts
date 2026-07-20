import { env } from "$env/dynamic/private";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  const API_URL = env.API_URL

  return {
    API_URL
  }
}
