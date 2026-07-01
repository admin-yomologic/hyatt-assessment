import { describe, expect, it } from "vitest";

import { ticketsQuerySchema } from "./ticketsQuerySchema";

describe("ticketsQuerySchema", () => {
  it("allows empty search", () => {
    const parsed = ticketsQuerySchema.safeParse({ search: "" });

    expect(parsed.success).toBe(true);
  });

  it("rejects one-character search", () => {
    const parsed = ticketsQuerySchema.safeParse({ search: "a" });

    expect(parsed.success).toBe(false);
  });

  it("rejects search longer than 120 chars", () => {
    const parsed = ticketsQuerySchema.safeParse({
      search: "a".repeat(121),
    });

    expect(parsed.success).toBe(false);
  });

  it("trims surrounding spaces", () => {
    const parsed = ticketsQuerySchema.safeParse({ search: "   ava   " });

    expect(parsed.success).toBe(true);

    if (parsed.success) {
      expect(parsed.data.search).toBe("ava");
    }
  });
});
