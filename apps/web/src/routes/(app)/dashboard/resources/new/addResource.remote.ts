import { form, getRequestEvent } from "$app/server";
import { apiClient } from "$lib/server/hono";
import { taxonomy } from "@repo/taxonomy";
import { z } from "zod"


export const createResourceForm = form(z.object({
  name: z.string().min(1).max(128),
  slug: z.string().min(3).max(32),
  description: z.string().min(10).max(256),
  category: z.enum(taxonomy.categories, {
    error: "Expected a type of category."
  })
}), async ({ name, slug, description, category }) => {

  const requestEvent = getRequestEvent();

  const resp = await apiClient.v1.resources.$post({
    json: {
      name,
      slug,
      description,
      category
    }
  },
    {
      headers: {
        Authorization: `Bearer ${requestEvent.cookies.get("session")}`
      }
    }
  )

  if (resp.status != 200) {
    if (resp.status === 400) {
      return {
        error: true as const,
        message: "400, Bad Request."
      }
    } else {
      const b = await resp.json()
      return {
        error: true as const,
        message: b.message
      }
    }
  }

  const r = await resp.json()
  return {
    error: false as const,
    message: r.message,
    result: r.resource
  }




})
