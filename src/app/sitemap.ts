import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/services", "/pricing", "/stores", "/book", "/about", "/terms"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
