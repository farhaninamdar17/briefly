import { NewsProvider } from "./types";
import { MockNewsProvider } from "./mockProvider";
import { RssNewsProvider } from "./rssProvider";
import { NewsApiProvider } from "./newsApiProvider";
import { NdmaAlertsProvider } from "./ndmaProvider";

export * from "./types";
export * from "./mockProvider";
export * from "./rssProvider";
export * from "./newsApiProvider";
export * from "./ndmaProvider";

export class NewsProviderRegistry {
  private providers: Map<string, NewsProvider> = new Map();
  public ndmaProvider: NdmaAlertsProvider;

  constructor() {
    this.ndmaProvider = new NdmaAlertsProvider();

    // Register Default Mock Curated Provider
    const mock = new MockNewsProvider();
    this.providers.set(mock.id, mock);

    // Register Standard Curated RSS feeds
    const theHinduRss = new RssNewsProvider(
      "rss_the_hindu",
      "The Hindu National",
      "https://www.thehindu.com/news/national/feeder/default.rss"
    );
    this.providers.set(theHinduRss.id, theHinduRss);

    // Register NewsAPI Provider
    const newsApi = new NewsApiProvider();
    this.providers.set(newsApi.id, newsApi);
  }

  public getProvider(id: string): NewsProvider | undefined {
    return this.providers.get(id);
  }

  public getAllProviders(): NewsProvider[] {
    return Array.from(this.providers.values());
  }

  public async getHealthReport() {
    const report = [];
    for (const p of this.providers.values()) {
      const status = await p.healthCheck();
      report.push({ id: p.id, name: p.name, ...status });
    }
    const ndmaStatus = await this.ndmaProvider.healthCheck();
    report.push({ id: this.ndmaProvider.id, name: this.ndmaProvider.name, ...ndmaStatus });
    return report;
  }
}

export const providerRegistry = new NewsProviderRegistry();
