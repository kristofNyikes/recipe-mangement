import { describe, expect, it } from "vitest";
import { createCollectionSchema } from "../schema";

describe("createCollectionSchema", () => {
  it("accepts a valid collection name", () => {
    expect(createCollectionSchema.safeParse({ name: "Desserts" }).success).toBe(
      true,
    );
  });

  it("trims whitespace from collection names", () => {
    const result = createCollectionSchema.safeParse({
      name: "  Desserts  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Desserts");
    }
  });

  it("rejects an empty collection name", () => {
    expect(createCollectionSchema.safeParse({ name: "" }).success).toBe(false);
  });

  it("rejects a collection name containing only whitespace", () => {
    expect(createCollectionSchema.safeParse({ name: "   " }).success).toBe(
      false,
    );
  });
});
