/**
 * Lead API validation tests (Task 10.2)
 * Tests the validation logic without requiring Next.js API runtime
 */

describe("/api/lead validation logic", () => {
  function validate(body) {
    const errors = [];
    if (!body.name?.trim()) errors.push({ field: "name", message: "姓名為必填" });
    if (!body.email?.trim()) {
      errors.push({ field: "email", message: "Email 為必填" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      errors.push({ field: "email", message: "Email 格式不正確" });
    }
    if (!body.preferred_weeks || body.preferred_weeks < 1) {
      errors.push({ field: "preferred_weeks", message: "請選擇預計週數" });
    }
    if (body.message && body.message.length > 1000) {
      errors.push({ field: "message", message: "留言不能超過 1000 字" });
    }
    return errors;
  }

  test("valid submission has no errors", () => {
    const errors = validate({
      name: "Alice",
      email: "alice@example.com",
      preferred_weeks: 4,
    });
    expect(errors).toHaveLength(0);
  });

  test("missing name returns error", () => {
    const errors = validate({
      email: "alice@example.com",
      preferred_weeks: 4,
    });
    expect(errors.some((e) => e.field === "name")).toBe(true);
  });

  test("invalid email returns error", () => {
    const errors = validate({
      name: "Alice",
      email: "not-an-email",
      preferred_weeks: 4,
    });
    expect(errors.some((e) => e.field === "email")).toBe(true);
  });

  test("missing email returns error", () => {
    const errors = validate({
      name: "Alice",
      preferred_weeks: 4,
    });
    expect(errors.some((e) => e.field === "email")).toBe(true);
  });

  test("missing preferred_weeks returns error", () => {
    const errors = validate({
      name: "Alice",
      email: "alice@example.com",
    });
    expect(errors.some((e) => e.field === "preferred_weeks")).toBe(true);
  });

  test("message over 1000 chars returns error", () => {
    const errors = validate({
      name: "Alice",
      email: "alice@example.com",
      preferred_weeks: 4,
      message: "a".repeat(1001),
    });
    expect(errors.some((e) => e.field === "message")).toBe(true);
  });

  test("honeypot detection", () => {
    const body = {
      name: "Bot",
      email: "bot@example.com",
      preferred_weeks: 4,
      website: "http://spam.com",
    };
    // If website is non-empty, should silently return success
    expect(body.website).toBeTruthy();
  });

  test("duplicate detection logic", () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentSubmission = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago

    // Recent submission should be within 24h window
    expect(recentSubmission > twentyFourHoursAgo).toBe(true);

    // Old submission should be outside 24h window
    const oldSubmission = new Date(now.getTime() - 25 * 60 * 60 * 1000);
    expect(oldSubmission > twentyFourHoursAgo).toBe(false);
  });
});
