/**
 * Get fee color class based on weekly USD fee
 * Budget: < $250 (green), Mid-range: $250-400 (amber), Premium: > $400 (coral)
 */
export function getFeeColorClass(weeklyFeeUsd) {
  if (weeklyFeeUsd < 250) return "fee-budget";
  if (weeklyFeeUsd <= 400) return "fee-mid";
  return "fee-premium";
}

/**
 * Get fee color hex value
 */
export function getFeeColor(weeklyFeeUsd) {
  if (weeklyFeeUsd < 250) return "#2D8B55";
  if (weeklyFeeUsd <= 400) return "#D4930D";
  return "#C74B1A";
}

/**
 * Format USD price
 */
export function formatUSD(amount) {
  return `$${Math.round(amount)}`;
}

/**
 * Format TWD price
 */
export function formatTWD(amount) {
  return `NT$${Math.round(amount).toLocaleString()}`;
}

/**
 * Convert USD to TWD (static rate from config)
 */
const USD_TO_TWD = 31;

export function usdToTwd(usd) {
  return Math.round(usd * USD_TO_TWD);
}

/**
 * Format weekly USD fee as TWD (primary display format across the site)
 * e.g. usdWeekly=280 → "NT$8,680/週"
 */
export function formatWeeklyTWD(usdWeekly) {
  return `NT$${usdToTwd(usdWeekly).toLocaleString()}/週`;
}

/**
 * Sanitize HTML — only allow <br> and <em> tags
 */
export function sanitizeHtml(html) {
  if (!html) return "";
  // First remove script/style tags and their content
  let clean = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  // Then remove all tags except br and em
  clean = clean.replace(/<(?!\/?(br|em)\b)[^>]*>/gi, "");
  // Remove event handlers
  clean = clean.replace(/on\w+="[^"]*"/gi, "");
  return clean;
}

/**
 * Truncate text to maxLength characters
 */
export function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
