import { NewsProvider, RawArticle } from "./types";
import { validateExternalUrl } from "../../security/urlValidator";

export class RssNewsProvider implements NewsProvider {
  public id: string;
  public name: string;
  private feedUrl: string;

  constructor(id: string, name: string, feedUrl: string) {
    this.id = id;
    this.name = name;
    this.feedUrl = feedUrl;
  }

  public async fetchArticles(): Promise<RawArticle[]> {
    const urlValidation = validateExternalUrl(this.feedUrl);
    if (!urlValidation.isValid || !urlValidation.sanitizedUrl) {
      throw new Error(`Invalid RSS Feed URL: ${urlValidation.reason}`);
    }

    try {
      // Safe fetch with 6 second timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(urlValidation.sanitizedUrl, {
        headers: { "User-Agent": "BrieflyBot/1.0 (+https://briefly.news)" },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Feed responded with HTTP ${res.status}`);
      }

      const xmlText = await res.text();
      return this.parseRssXml(xmlText);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.warn(`[RSS Provider] Failed to fetch feed ${this.name}: ${errorMessage}`);
      return [];
    }
  }

  private parseRssXml(xml: string): RawArticle[] {
    const items: RawArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
      const itemContent = match[1];
      const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/title>/i);
      const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/description>/i);
      const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))<\/link>/i);
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/i);

      const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim();
      const description = (descMatch?.[1] || descMatch?.[2] || "").replace(/<[^>]*>?/gm, "").trim();
      const link = (linkMatch?.[1] || linkMatch?.[2] || "").trim();
      const pubDate = pubDateMatch?.[1] ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

      if (title && link) {
        const linkVal = validateExternalUrl(link);
        if (linkVal.isValid && linkVal.sanitizedUrl) {
          items.push({
            sourceId: this.id,
            sourceName: this.name,
            externalId: linkVal.sanitizedUrl,
            title,
            description,
            url: linkVal.sanitizedUrl,
            publishedAt: pubDate,
          });
        }
      }
    }

    return items;
  }

  public async healthCheck() {
    const start = Date.now();
    try {
      const urlVal = validateExternalUrl(this.feedUrl);
      if (!urlVal.isValid) return { healthy: false, latencyMs: 0, message: "URL validation failed" };
      return { healthy: true, latencyMs: Date.now() - start, message: "Feed accessible" };
    } catch {
      return { healthy: false, latencyMs: Date.now() - start, message: "Unreachable" };
    }
  }
}
