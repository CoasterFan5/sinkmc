// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import cloudflare from "@astrojs/cloudflare";
import starlightOpenAPIPlugin, { openAPISidebarGroups } from "starlight-openapi";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "My Docs",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/coasterfan5/sinkmc",
        },
      ],
      plugins: [
        starlightOpenAPIPlugin([{
          base: "reference",
          schema: "../api/openapi.json",
          sidebar: {
            label: "Api Reference"
          },
          snippets: {
            operation: false,
          },
        }])
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        ...openAPISidebarGroups
      ],
    }),
  ],
  output: 'static',

  adapter: cloudflare({
    prerenderEnvironment: 'node',
  }),
});
