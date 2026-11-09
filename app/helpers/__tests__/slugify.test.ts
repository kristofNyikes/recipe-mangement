import { describe, expect, it, vi } from "vitest";
import generateSLug from "../slugify";

vi.mock("nanoid", () => ({
  nanoid: () => "abc123",
}));

describe("generateSLug", () => {
  it("generates a lowercase slug with a unique suffix", () => {
    expect(generateSLug("Chocolate Cake")).toBe("chocolate-cake-abc123");
  });

  it("removes special characters", () => {
    expect(generateSLug("Creamy Pasta!")).toBe("creamy-pasta-abc123");
  });

  it("handles uppercase input", () => {
    expect(generateSLug("CHOCOLATE CAKE")).toBe("chocolate-cake-abc123");
  });

  it("handles multiple spaces", () => {
    expect(generateSLug("Chocolate    Cake")).toBe("chocolate-cake-abc123");
  });
});
