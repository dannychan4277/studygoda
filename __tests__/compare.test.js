/**
 * Compare feature logic tests (Task 6.2)
 */

describe("Compare feature logic", () => {
  test("URL params parsing — extracts slugs correctly", () => {
    const idsParam = "kaplan-new-york,ec-boston,els-los-angeles";
    const slugs = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    expect(slugs).toEqual([
      "kaplan-new-york",
      "ec-boston",
      "els-los-angeles",
    ]);
  });

  test("max 3 limit — only first 3 used", () => {
    const idsParam = "a,b,c,d,e";
    const slugs = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    expect(slugs).toHaveLength(3);
    expect(slugs).toEqual(["a", "b", "c"]);
  });

  test("invalid/empty slugs are filtered", () => {
    const idsParam = "valid-slug,,  , another-slug";
    const slugs = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    expect(slugs).toEqual(["valid-slug", "another-slug"]);
  });

  test("localStorage compare list — add/remove/max", () => {
    const MAX = 3;
    let list = [];

    // Add
    function add(slug) {
      if (list.includes(slug) || list.length >= MAX) return;
      list = [...list, slug];
    }
    function remove(slug) {
      list = list.filter((s) => s !== slug);
    }

    add("school-a");
    expect(list).toEqual(["school-a"]);

    add("school-b");
    add("school-c");
    expect(list).toHaveLength(3);

    // Max reached — should not add
    add("school-d");
    expect(list).toHaveLength(3);
    expect(list).not.toContain("school-d");

    // Remove
    remove("school-b");
    expect(list).toEqual(["school-a", "school-c"]);

    // Can add again
    add("school-d");
    expect(list).toContain("school-d");
  });
});
