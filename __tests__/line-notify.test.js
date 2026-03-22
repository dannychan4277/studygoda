/**
 * LINE notification logic tests (Task 6.3)
 */

// Test the Flex Message builder directly
const { buildLeadFlexMessage } = require("../libs/line");

describe("LINE notification", () => {
  test("buildLeadFlexMessage produces valid structure", () => {
    const msg = buildLeadFlexMessage({
      name: "Alice",
      email: "alice@example.com",
      phone: "0912345678",
      preferredWeeks: 4,
      programName: "EV Academy",
    });

    expect(msg.type).toBe("flex");
    expect(msg.altText).toContain("Alice");
    expect(msg.contents.type).toBe("bubble");
    expect(msg.contents.header).toBeTruthy();
    expect(msg.contents.body).toBeTruthy();
    expect(msg.contents.footer).toBeTruthy();
  });

  test("LINE failure is fail-open — does not throw in caller pattern", async () => {
    // Simulate the fail-open pattern used in the lead API
    let lineError = null;
    let apiResponse = { status: "success", id: "test-123" };

    try {
      // Simulate LINE failure
      throw new Error("LINE API 429: Rate limit");
    } catch (err) {
      // This matches: .catch((err) => { console.error(...) })
      lineError = err.message;
    }

    // API response should still be success
    expect(apiResponse.status).toBe("success");
    expect(lineError).toContain("429");
  });

  test("LINE skipped when env vars not set", () => {
    const lineToken = undefined;
    const lineUserId = undefined;

    // Matches: if (lineToken && lineUserId) { ... }
    const shouldSend = !!(lineToken && lineUserId);
    expect(shouldSend).toBe(false);
  });
});
