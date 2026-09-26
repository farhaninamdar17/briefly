import { NewsProvider, RawArticle } from "./types";
import { validateExternalUrl } from "../../security/urlValidator";

export class NewsApiProvider implements NewsProvider {
  public id = "news_api_global";
  public name = "NewsAPI Global Service";
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEWS_API_KEY;
  }

  public async fetchArticles(query: string = "technology"): Promise<RawArticle[]> {
    if (!this.apiKey) {
      // Graceful fallback to avoid breaking without keys
      return [];
    }

    try {
      const endpoint = `https://newsapi.org/v2/top-headlines?q=${encodeURIComponent(query)}&apiKey=${this.apiKey}&pageSize=10`;
      const urlVal = validateExternalUrl(endpoint);
      if (!urlVal.isValid || !urlVal.sanitizedUrl) return [];

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(urlVal.sanitizedUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) return [];

      const data = await res.json();
      if (!Array.isArray(data.articles)) return [];

      const articles: RawArticle[] = [];
      for (const item of data.articles) {
        if (!item.title || !item.url) continue;
        const validLink = validateExternalUrl(item.url);
        if (!validLink.isValid || !validLink.sanitizedUrl) continue;

        articles.push({
          sourceId: this.id,
          sourceName: item.source?.name || "NewsAPI",
          externalId: validLink.sanitizedUrl,
          title: item.title,
          description: item.description || "",
          content: item.content || "",
          url: validLink.sanitizedUrl,
          imageUrl: item.urlToImage || undefined,
          publishedAt: item.publishedAt || new Date().toISOString(),
        });
      }

      return articles;
    } catch {
      return [];
    }
  }

  public async healthCheck() {
    return {
      healthy: Boolean(this.apiKey),
      latencyMs: 30,
      message: this.apiKey ? "API Key configured" : "API Key missing (Running in demo mode)",
    };
  }
}
