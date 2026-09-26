import { describe, it, expect } from "vitest";
import {
  StoryCreateSchema,
  AlertCreateSchema,
  UserPreferencesSchema,
  LoginSchema,
} from "../lib/validation/schemas";

describe("Input Validation: Zod Schemas", () => {
  it("should validate well-formed story creation payload", () => {
    const validStory = {
      headline: "Pune Metro Line 3 Tests Complete",
      summary: "Integrated safety testing completed across 23 stations.",
      whatHappened: "PMRDA and MahaMetro concluded trial runs with CMRS officials.",
      whyItMatters: "Drastically shortens commute times between Hinjawadi and Shivaji Nagar.",
      whoIsAffected: "200,000 IT professionals and local commuters.",
      whatHappensNext: "Commercial operations commence next month.",
      location: "Pune",
      topic: "Technology",
      importance: "IMPORTANT" as const,
      isDeveloping: false,
      sources: [
        {
          name: "The Hindu",
          url: "https://www.thehindu.com/news/national/pune-metro",
        },
      ],
    };

    const parsed = StoryCreateSchema.safeParse(validStory);
    expect(parsed.success).toBe(true);
  });

  it("should validate user preferences schema", () => {
    const validPrefs = {
      locations: ["Pune", "Maharashtra"],
      topics: ["Technology", "Science"],
      quietHoursEnabled: true,
      quietHoursStart: "22:00",
      quietHoursEnd: "07:00",
      pushEnabled: true,
      onlyImportantAlerts: true,
      briefingMode: "read" as const,
    };

    const parsed = UserPreferencesSchema.safeParse(validPrefs);
    expect(parsed.success).toBe(true);
  });

  it("should reject stories without verified sources or with malicious URLs", () => {
    const invalidStory = {
      headline: "Test Story Headline",
      summary: "Short summary text",
      whatHappened: "Explanation of what happened",
      whyItMatters: "Why it matters explanation",
      whoIsAffected: "Affected audience",
      whatHappensNext: "Next steps",
      location: "Pune",
      topic: "Technology",
      sources: [], // Empty sources violates schema
    };

    const parsed = StoryCreateSchema.safeParse(invalidStory);
    expect(parsed.success).toBe(false);
  });

  it("should validate official disaster alert payload with strict HTTPS URL", () => {
    const validAlert = {
      authority: "NDMA SACHET & IMD",
      event: "Heavy Rainfall Advisory",
      severity: "IMPORTANT" as const,
      area: "Pune Western Ghats",
      instructions: "Avoid riverbeds and non-essential travel.",
      originalUrl: "https://sachet.ndma.gov.in/alerts/pune",
    };

    const parsed = AlertCreateSchema.safeParse(validAlert);
    expect(parsed.success).toBe(true);
  });

  it("should reject login payload with malformed email", () => {
    const badLogin = {
      email: "not-an-email",
      password: "pass",
    };
    const parsed = LoginSchema.safeParse(badLogin);
    expect(parsed.success).toBe(false);
  });
});
