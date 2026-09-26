import { RawArticle } from "../news/providers/types";

export interface ClusteredStoryGroup {
  clusterId: string;
  primaryTitle: string;
  articles: RawArticle[];
  commonKeywords: string[];
}

/**
 * Heuristic & Token Jaccard Distance Clustering
 * Groups multi-source reporting of the same underlying news event
 */
export function clusterRelatedArticles(articles: RawArticle[]): ClusteredStoryGroup[] {
  const clusters: ClusteredStoryGroup[] = [];
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "with", "is", "was",
    "by", "as", "of", "from", "that", "this", "it", "are", "be", "has", "have", "had"
  ]);

  const tokenize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
  };

  for (const article of articles) {
    const articleTokens = new Set(tokenize(`${article.title} ${article.description}`));
    let matchedCluster: ClusteredStoryGroup | null = null;
    let maxOverlap = 0;

    for (const cluster of clusters) {
      const clusterTokens = new Set(tokenize(cluster.primaryTitle));
      let intersectionCount = 0;

      for (const token of articleTokens) {
        if (clusterTokens.has(token)) {
          intersectionCount++;
        }
      }

      const jaccardScore =
        intersectionCount / (articleTokens.size + clusterTokens.size - intersectionCount || 1);

      if (jaccardScore > 0.35 && jaccardScore > maxOverlap) {
        maxOverlap = jaccardScore;
        matchedCluster = cluster;
      }
    }

    if (matchedCluster) {
      matchedCluster.articles.push(article);
    } else {
      clusters.push({
        clusterId: `cluster_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        primaryTitle: article.title,
        articles: [article],
        commonKeywords: Array.from(articleTokens).slice(0, 5),
      });
    }
  }

  return clusters;
}
