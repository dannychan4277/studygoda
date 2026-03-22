/**
 * Utility tests (covers fee color encoding, HTML sanitization, etc.)
 */

import { getFeeColorClass, getFeeColor, sanitizeHtml, truncate, formatUSD, formatTWD } from "@/libs/utils";

describe("getFeeColorClass", () => {
  test("budget (< $250) returns fee-budget", () => {
    expect(getFeeColorClass(200)).toBe("fee-budget");
    expect(getFeeColorClass(0)).toBe("fee-budget");
    expect(getFeeColorClass(249)).toBe("fee-budget");
  });

  test("mid-range ($250-400) returns fee-mid", () => {
    expect(getFeeColorClass(250)).toBe("fee-mid");
    expect(getFeeColorClass(300)).toBe("fee-mid");
    expect(getFeeColorClass(400)).toBe("fee-mid");
  });

  test("premium (> $400) returns fee-premium", () => {
    expect(getFeeColorClass(401)).toBe("fee-premium");
    expect(getFeeColorClass(500)).toBe("fee-premium");
  });
});

describe("sanitizeHtml", () => {
  test("strips dangerous tags", () => {
    expect(sanitizeHtml('<script>alert("xss")</script>Hello')).toBe('Hello');
    expect(sanitizeHtml('<img src=x onerror=alert(1)>Test')).toBe('Test');
  });

  test("preserves allowed tags", () => {
    expect(sanitizeHtml("Line 1<br>Line 2")).toBe("Line 1<br>Line 2");
    expect(sanitizeHtml("<em>emphasis</em>")).toBe("<em>emphasis</em>");
  });

  test("handles null/empty", () => {
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml("")).toBe("");
  });
});

describe("truncate", () => {
  test("truncates long text", () => {
    const long = "a".repeat(200);
    const result = truncate(long, 120);
    expect(result.length).toBeLessThanOrEqual(121); // 120 + ellipsis
    expect(result.endsWith("…")).toBe(true);
  });

  test("does not truncate short text", () => {
    expect(truncate("Hello", 120)).toBe("Hello");
  });
});

describe("formatUSD / formatTWD", () => {
  test("formats USD", () => {
    expect(formatUSD(250)).toBe("$250");
    expect(formatUSD(199.5)).toBe("$200");
  });

  test("formats TWD", () => {
    expect(formatTWD(35000)).toContain("NT$");
    expect(formatTWD(35000)).toContain("35");
  });
});
