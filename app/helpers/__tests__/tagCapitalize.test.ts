import { describe, expect, it } from "vitest";
import { tagCapitalize } from "../tagCapitalize";

describe("tagCapitalize", () => {
  it("capitalizes a single word", () => {
    expect(tagCapitalize("BREAKFAST")).toBe("Breakfast");
  });

  it("converts underscores into spaces", () => {
    expect(tagCapitalize("LOW_CARB")).toBe("Low Carb");
  });

  it("handles multiple words", () => {
    expect(tagCapitalize("HIGH_PROTEIN_LOW_CARB")).toBe(
      "High Protein Low Carb",
    );
  });

  it("handles lowercase input", () => {
    expect(tagCapitalize("breakfast")).toBe("Breakfast");
  });
});
