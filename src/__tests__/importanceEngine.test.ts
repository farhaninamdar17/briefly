import { describe, it, expect } from "vitest";
import { calculateImportanceLevel } from "../lib/ai/importanceEngine";
import { RawArticle } from "../lib/news/providers/types";

describe("AI: Importance Engine & Alert Calibration", () => {
  const mockArticle: RawArticle = {
    sourceId: "src_1",
    sourceName: "The Hindu",
    externalId: "ext_1",
    title: "City Council Approves New Public Park",
    description: "New green space will open in Hadapsar next year.",
    url: "https://thehindu.com/news",
    publishedAt: new Date().toISOString(),
  };

  it("should assign NORMAL importance to standard local updates", () => {
    const level = calculateImportanceLevel(
      mockArticle.title,
      mockArticle.description,
      [mockArticle]
    );
    expect(level).toBe("NORMAL");
  });

  it("should assign CRITICAL importance when disaster keywords exist", () => {
    const disasterArticle: RawArticle = {
      ...mockArticle,
      title: "Immediate Evacuate Order for Riverbed Settlements",
      description: "Severe flash flood warning issued after dam discharge.",
    };
    const level = calculateImportanceLevel(
      disasterArticle.title,
      disasterArticle.description,
      [disasterArticle]
    );
    expect(level).toBe("CRITICAL");
  });

  it("should escalate to IMPORTANT when verified by 3+ independent sources", () => {
    const source1: RawArticle = { ...mockArticle, sourceName: "The Hindu" };
    const source2: RawArticle = { ...mockArticle, sourceName: "Indian Express" };
    const source3: RawArticle = { ...mockArticle, sourceName: "Reuters" };

    const level = calculateImportanceLevel(
      "Major State Highway Infrastructure Accord Signed",
      "Tripartite agreement finalized.",
      [source1, source2, source3]
    );
    expect(level).toBe("IMPORTANT");
  });
});
