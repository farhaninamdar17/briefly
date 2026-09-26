import { StoryDTO, DailyBriefingDTO } from "../dal/dto";

export function generateDailyBriefing(stories: StoryDTO[]): DailyBriefingDTO {
  const today = new Date().toISOString().split("T")[0];
  
  // Pick top stories for Local, National, World, Interest
  const localStory = stories.find((s) => s.location === "Pune" || s.location === "Mumbai") || stories[0];
  const nationalStory = stories.find((s) => s.location === "India" && s.id !== localStory?.id) || stories[1];
  const worldStory = stories.find((s) => s.location === "World") || stories[2];
  const interestStory = stories.find((s) => s.topic === "Technology" && s.id !== localStory?.id && s.id !== nationalStory?.id) || stories[3];

  const items = [
    {
      id: `br_${localStory.id}`,
      section: "LOCAL" as const,
      headline: localStory.headline,
      summary: localStory.summary,
      location: localStory.location,
      topic: localStory.topic,
      readTime: `${localStory.readingTimeMinutes} min`,
      storyId: localStory.id,
    },
    {
      id: `br_${nationalStory.id}`,
      section: "NATIONAL" as const,
      headline: nationalStory.headline,
      summary: nationalStory.summary,
      location: nationalStory.location,
      topic: nationalStory.topic,
      readTime: `${nationalStory.readingTimeMinutes} min`,
      storyId: nationalStory.id,
    },
    {
      id: `br_${worldStory.id}`,
      section: "WORLD" as const,
      headline: worldStory.headline,
      summary: worldStory.summary,
      location: worldStory.location,
      topic: worldStory.topic,
      readTime: `${worldStory.readingTimeMinutes} min`,
      storyId: worldStory.id,
    },
    {
      id: `br_${interestStory.id}`,
      section: "INTEREST" as const,
      headline: interestStory.headline,
      summary: interestStory.summary,
      location: interestStory.location,
      topic: interestStory.topic,
      readTime: `${interestStory.readingTimeMinutes} min`,
      storyId: interestStory.id,
    },
  ];

  return {
    id: `briefing_${today.replace(/-/g, "_")}`,
    date: today,
    title: `Your 5-Minute Briefing for ${new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date())}`,
    estimatedMinutes: 5,
    audioDurationSeconds: 280,
    items,
  };
}
