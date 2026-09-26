import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dataStore } from "@/lib/db/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SourceComparisonCard } from "@/components/news/SourceComparisonCard";
import { DevelopingStoryTimeline } from "@/components/news/DevelopingStoryTimeline";
import { WhyAmISeeingThis } from "@/components/news/WhyAmISeeingThis";
import { ArrowLeft, Clock, MapPin, Radio, ShieldCheck } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const story = dataStore.getStoryById(id);

  if (!story) {
    return { title: "Story Not Found — BRIEFLY" };
  }

  return {
    title: `${story.headline} — BRIEFLY`,
    description: story.summary,
    openGraph: {
      title: story.headline,
      description: story.summary,
      images: story.imageUrl ? [story.imageUrl] : [],
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = dataStore.getStoryById(id);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-foreground">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Feed</span>
        </Link>

        {/* Story Header */}
        <article className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                {story.topic}
              </span>
              {story.isDeveloping && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Developing Story
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-neutral-950 dark:text-neutral-50 leading-tight">
              {story.headline}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-editorial-accent" />
                {story.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatTimeAgo(story.publishedAt)}
              </span>
              <span>•</span>
              <span>{story.readingTimeMinutes} min read</span>
            </div>

            {story.whyYouSeeThis && (
              <WhyAmISeeingThis reason={story.whyYouSeeThis} />
            )}
          </div>

          {/* Lead Image */}
          {story.imageUrl && (
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shadow-md">
              <Image
                src={story.imageUrl}
                alt={story.headline}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          {/* Developing Story Timeline (if applicable) */}
          {story.isDeveloping && story.timeline && (
            <DevelopingStoryTimeline timeline={story.timeline} />
          )}

          {/* 4-Part Clarity Structure (Section 28) */}
          <div className="space-y-6 pt-2">
            <section className="bg-editorial-surface rounded-2xl p-5 sm:p-6 border border-editorial-border shadow-2xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white" />
                What happened?
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whatHappened}
              </p>
            </section>

            <section className="bg-editorial-surface rounded-2xl p-5 sm:p-6 border border-editorial-border shadow-2xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-editorial-accent" />
                Why it matters
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whyItMatters}
              </p>
            </section>

            <section className="bg-editorial-surface rounded-2xl p-5 sm:p-6 border border-editorial-border shadow-2xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Who is affected
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whoIsAffected}
              </p>
            </section>

            <section className="bg-editorial-surface rounded-2xl p-5 sm:p-6 border border-editorial-border shadow-2xs">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                What happens next
              </h2>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                {story.whatHappensNext}
              </p>
            </section>
          </div>

          {/* Source Comparison and Transparency (Section 32) */}
          <SourceComparisonCard sources={story.sources} />

          <div className="p-4 rounded-xl bg-neutral-100/60 dark:bg-neutral-900 border border-editorial-border flex items-center gap-3 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              This briefing synthesizes {story.sources.length} verified news reports without editorial bias or political ranking.
            </span>
          </div>
        </article>
      </main>

      <MobileNavigation />
      <Footer />
    </div>
  );
}
