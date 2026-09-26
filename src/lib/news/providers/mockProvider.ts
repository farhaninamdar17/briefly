import { NewsProvider, RawArticle } from "./types";
import { MOCK_STORIES } from "../../data/mockStories";

export class MockNewsProvider implements NewsProvider {
  public id = "mock_curated_provider";
  public name = "Briefly Verified Editorial Feed";

  public async fetchArticles(): Promise<RawArticle[]> {
    return MOCK_STORIES.flatMap((story) =>
      story.sources.map((src, idx) => ({
        sourceId: `src_${story.id}_${idx}`,
        sourceName: src.name,
        externalId: `${story.id}_${idx}`,
        title: story.headline,
        description: story.summary,
        content: story.whatHappened,
        url: src.url,
        imageUrl: story.imageUrl,
        publishedAt: story.publishedAt,
        rawCategory: story.topic,
      }))
    );
  }

  public async healthCheck() {
    return {
      healthy: true,
      latencyMs: 12,
      message: "Editorial feed active with 10 verified stories.",
    };
  }
}
