// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { siteConfig } from "./src/config/site.ts";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  integrations: [sitemap(), mdx()],
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
});
