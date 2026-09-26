import { providerRegistry } from "./providers";
import { RawArticle } from "./providers/types";
import { validateExternalUrl } from "../security/urlValidator";
import { clusterRelatedArticles } from "../ai/clustering";
import { generateStorySummary } from "../ai/summarizer";
import { calculateImportanceLevel } from "../ai/importanceEngine";
import { StoryDTO } from "../dal/dto";
import { dataStore } from "../db/store";
import { logAuditEvent } from "../security/auditLog";

export interface PipelineExecutionReport {
  timestamp: string;
  providersQueried: number;
  rawArticlesIngested: number;
  validArticles: number;
  clustersFormed: number;
  storiesPublished: number;
  durationMs: number;
}

/**
 * End-to-end News Processing Pipeline
 * Follows strict fact-grounding and source transparency
 */
export async function runNewsProcessingPipeline(): Promise<PipelineExecutionReport> {
  const startTime = Date.now();
  const providers = providerRegistry.getAllProviders();
  let rawArticles: RawArticle[] = [];

  // 1. SOURCE & INGEST
  for (const provider of providers) {
    try {
      const articles = await provider.fetchArticles();
      rawArticles = rawArticles.concat(articles);
    } catch (err: unknown) {
      console.warn(`[Pipeline] Provider ${provider.name} failed:`, err);
    }
  }

  // 2. VALIDATE & NORMALIZE
  const validArticles: RawArticle[] = [];
  for (const article of rawArticles) {
    if (!article.title || !article.url) continue;
    const urlCheck = validateExternalUrl(article.url);
    if (!urlCheck.isValid || !urlCheck.sanitizedUrl) continue;

    validArticles.push({
      ...article,
      url: urlCheck.sanitizedUrl,
      title: article.title.trim(),
      description: article.description?.trim() || "",
    });
  }

  // 3. DEDUPLICATE & CLUSTER
  const clusters = clusterRelatedArticles(validArticles);

  let publishedCount = 0;

  // 4. CLASSIFY, SUMMARIZE, IMPORTANCE & PUBLISH
  for (const cluster of clusters) {
    const summaryData = await generateStorySummary(cluster.articles);
    const importance = calculateImportanceLevel(
      summaryData.headline,
      summaryData.summary,
      cluster.articles
    );

    const newStory: StoryDTO = {
      id: `story_auto_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      headline: summaryData.headline,
      summary: summaryData.summary,
      whatHappened: summaryData.whatHappened,
      whyItMatters: summaryData.whyItMatters,
      whoIsAffected: summaryData.whoIsAffected,
      whatHappensNext: summaryData.whatHappensNext,
      location: summaryData.detectedLocation,
      topic: summaryData.detectedTopic,
      importance,
      isDeveloping: false,
      publishedAt: new Date().toISOString(),
      readingTimeMinutes: summaryData.readingTimeMinutes,
      imageUrl: cluster.articles.find((a) => a.imageUrl)?.imageUrl,
      sources: cluster.articles.map((a) => ({
        name: a.sourceName,
        url: a.url,
      })),
      whyYouSeeThis: `You follow ${summaryData.detectedLocation} and ${summaryData.detectedTopic}.`,
    };

    dataStore.addStory(newStory);
    publishedCount++;
  }

  const durationMs = Date.now() - startTime;

  logAuditEvent({
    adminId: "system_pipeline",
    adminEmail: "pipeline@briefly.news",
    action: "PIPELINE_RUN",
    targetType: "SYSTEM",
    targetId: "global_pipeline",
    result: "SUCCESS",
    metadata: {
      rawArticlesCount: rawArticles.length,
      clustersCount: clusters.length,
      publishedCount,
      durationMs,
    },
    ipHash: "system_internal",
  });

  return {
    timestamp: new Date().toISOString(),
    providersQueried: providers.length,
    rawArticlesIngested: rawArticles.length,
    validArticles: validArticles.length,
    clustersFormed: clusters.length,
    storiesPublished: publishedCount,
    durationMs,
  };
}
