export interface RawArticle {
  sourceId: string;
  sourceName: string;
  externalId: string;
  title: string;
  description: string;
  content?: string;
  author?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  rawCategory?: string;
  language?: string;
}

export interface NewsProviderConfig {
  id: string;
  name: string;
  enabled: boolean;
  apiKey?: string;
  feedUrl?: string;
}

export interface NewsProvider {
  id: string;
  name: string;
  fetchArticles(query?: string): Promise<RawArticle[]>;
  healthCheck(): Promise<{ healthy: boolean; latencyMs: number; message?: string }>;
}
