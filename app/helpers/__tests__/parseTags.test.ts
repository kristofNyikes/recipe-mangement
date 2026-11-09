import { describe, expect, it } from "vitest";
import { parseTags } from "../parseTags";

describe("parseTags", () => {
  it("returns an empty array when no values are provided", () => {
    expect(parseTags()).toEqual([]);
  });

  it("parses a comma-separated string of valid tags", () => {
    expect(parseTags("BREAKFAST,DESSERT")).toEqual(["BREAKFAST", "DESSERT"]);
  });

  it("accepts an array of tags", () => {
    expect(parseTags(["BREAKFAST", "DESSERT"])).toEqual([
      "BREAKFAST",
      "DESSERT",
    ]);
  });

  it("filters out invalid tags", () => {
    expect(parseTags("BREAKFAST,INVALID,DESSERT")).toEqual([
      "BREAKFAST",
      "DESSERT",
    ]);
  });

  it("returns an empty array when all tags are invalid", () => {
    expect(parseTags("INVALID,UNKNOWN")).toEqual([]);
  });
});
