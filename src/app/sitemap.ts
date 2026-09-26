import { MetadataRoute } from "next";
import { dataStore } from "@/lib/db/store";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://briefly.news";
  const stories = dataStore.getStories();

  const storyEntries: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${baseUrl}/story/${s.id}`,
    lastModified: new Date(s.publishedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/briefing`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/alerts`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...storyEntries,
  ];
}
