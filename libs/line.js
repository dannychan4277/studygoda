import config from "@/config";

/**
 * Send a LINE push message to the admin user.
 * Returns true on success, false on failure (fail-open).
 */
export async function sendLinePushMessage(userId, flexMessage) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token || !userId) return false;

  const res = await fetch(config.line.pushApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [flexMessage],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LINE API ${res.status}: ${body}`);
  }

  return true;
}

/**
 * Build a Flex Message for a new lead notification.
 */
export function buildLeadFlexMessage({ name, email, phone, preferredWeeks, programName }) {
  const now = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });

  return {
    type: "flex",
    altText: `新的遊學諮詢：${name}`,
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "新的遊學諮詢 🎓",
            weight: "bold",
            size: "lg",
            color: "#1A6B5A",
          },
        ],
        paddingAll: "16px",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          infoRow("姓名", name),
          infoRow("Email", email),
          infoRow("電話", phone || "未提供"),
          infoRow("預計週數", preferredWeeks ? `${preferredWeeks} 週` : "未指定"),
          ...(programName ? [infoRow("學校", programName)] : []),
        ],
        spacing: "sm",
        paddingAll: "16px",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: now,
            size: "xs",
            color: "#8A8A9A",
            align: "end",
          },
        ],
        paddingAll: "16px",
      },
    },
  };
}

/**
 * Build a Flex Message for a new leads_v2 notification (7.6).
 * Includes LINE ID, interested countries, budget, etc.
 */
export function buildLeadV2FlexMessage({
  name,
  lineId,
  email,
  phone,
  interestedCountries,
  budget,
  duration,
  goal,
}) {
  const now = new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  const countriesText =
    interestedCountries?.length > 0 ? interestedCountries.join(", ") : "未指定";

  const bodyContents = [
    infoRow("姓名", name),
    infoRow("LINE ID", lineId || "未提供"),
    infoRow("Email", email || "未提供"),
    infoRow("電話", phone || "未提供"),
    infoRow("國家", countriesText),
  ];

  if (budget) bodyContents.push(infoRow("預算", budget));
  if (duration) bodyContents.push(infoRow("時長", duration));
  if (goal) bodyContents.push(infoRow("目標", goal));

  return {
    type: "flex",
    altText: `新的遊學諮詢：${name}（LINE: ${lineId || "N/A"}）`,
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "新的遊學諮詢",
            weight: "bold",
            size: "lg",
            color: "#1A6B5A",
          },
        ],
        paddingAll: "16px",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: bodyContents,
        spacing: "sm",
        paddingAll: "16px",
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: now,
            size: "xs",
            color: "#8A8A9A",
            align: "end",
          },
        ],
        paddingAll: "16px",
      },
    },
  };
}

function infoRow(label, value) {
  return {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: label,
        size: "sm",
        color: "#5A5A6E",
        flex: 2,
      },
      {
        type: "text",
        text: value,
        size: "sm",
        color: "#1A1A2E",
        flex: 4,
        wrap: true,
      },
    ],
  };
}
