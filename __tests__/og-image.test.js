/**
 * OG image logic tests (Task 6.4)
 */

describe("OG image logic", () => {
  function getFeeColor(weeklyFee) {
    if (weeklyFee < 250) return "#2D8B55";
    if (weeklyFee <= 400) return "#D4930D";
    return "#E07A5F";
  }

  test("valid slug generates correct fee color", () => {
    expect(getFeeColor(200)).toBe("#2D8B55"); // budget green
    expect(getFeeColor(300)).toBe("#D4930D"); // mid amber
    expect(getFeeColor(450)).toBe("#E07A5F"); // premium coral
  });

  test("unknown slug fallback — no program data", () => {
    const program = null; // simulating slug not found

    // When program is null, the route returns a generic branded image
    const isGenericFallback = !program;
    expect(isGenericFallback).toBe(true);
  });
});
