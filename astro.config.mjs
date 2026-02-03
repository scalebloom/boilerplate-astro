// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import criticalCss from "astro-critical-css";

// https://astro.build/config
export default defineConfig({
  site: "https://www.acornpals.com",
  integrations: [
    sitemap(),
    criticalCss(),
  ],
  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },
});
