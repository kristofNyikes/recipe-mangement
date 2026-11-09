import { describe, expect, it } from "vitest";
import { RegisterSchema } from "../schema";

describe("RegisterSchema", () => {
  it("accepts valid registration data", () => {
    expect(
      RegisterSchema.safeParse({
        email: "user@example.com",
        password: "password123",
      }).success,
    ).toBe(true);
  });

  it("normalizes email by trimming and lowercasing", () => {
    const result = RegisterSchema.safeParse({
      email: "  USER@EXAMPLE.COM  ",
      password: "password123",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("rejects invalid email addresses", () => {
    expect(
      RegisterSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      }).success,
    ).toBe(false);
  });

  it("rejects passwords shorter than 7 characters", () => {
    expect(
      RegisterSchema.safeParse({
        email: "user@example.com",
        password: "123456",
      }).success,
    ).toBe(false);
  });

  it("rejects passwords longer than 128 characters", () => {
    expect(
      RegisterSchema.safeParse({
        email: "user@example.com",
        password: "a".repeat(129),
      }).success,
    ).toBe(false);
  });
});
