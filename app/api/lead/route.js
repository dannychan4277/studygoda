import { NextResponse } from "next/server";
import { getServiceClient } from "@/libs/supabase";

const LINE_ID_REGEX = /^[a-zA-Z0-9._-]{4,20}$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ field: "_body", message: "Invalid JSON" }] },
      { status: 400 }
    );
  }

  const {
    name,
    line_id,
    email,
    phone,
    interested_countries,
    interested_schools,
    budget_twd_monthly,
    preferred_duration,
    target_start,
    goal,
    message,
    source_page,
    utm_source,
    utm_medium,
    utm_campaign,
    // Legacy fields (backward compatibility with old LeadForm)
    program_id,
    preferred_weeks,
    website,
  } = body;

  // Legacy honeypot check (old LeadForm still sends website field)
  if (website) {
    return NextResponse.json({ status: "success", id: "honeypot" });
  }

  // Validation
  const errors = [];
  if (!name?.trim()) errors.push({ field: "name", message: "姓名為必填" });

  // New form requires line_id; legacy form requires email
  const hasLineId = line_id?.trim();
  const hasEmail = email?.trim();

  if (!hasLineId && !hasEmail) {
    errors.push({ field: "line_id", message: "LINE ID 為必填" });
  }

  if (hasLineId && !LINE_ID_REGEX.test(line_id.trim())) {
    errors.push({ field: "line_id", message: "LINE ID 格式不正確（4-20 字元，僅限英數字、點、底線、減號）" });
  }

  if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "Email 格式不正確" });
  }

  if (message && message.length > 1000) {
    errors.push({ field: "message", message: "留言不能超過 1000 字" });
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const supabase = getServiceClient();

    // 7.4: Duplicate submission prevention — line_id based (3 per 24h)
    if (hasLineId) {
      const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString();

      const { data: recent, error: countError } = await supabase
        .from("leads_v2")
        .select("id")
        .eq("line_id", line_id.trim())
        .gte("created_at", twentyFourHoursAgo);

      if (!countError && recent && recent.length >= 3) {
        return NextResponse.json(
          { error: "你已經送出多次諮詢，請 24 小時後再試" },
          { status: 429 }
        );
      }
    }

    // 7.5: Insert into leads_v2
    const { data: lead, error } = await supabase
      .from("leads_v2")
      .insert({
        name: name.trim(),
        line_id: hasLineId ? line_id.trim() : null,
        email: hasEmail ? email.trim() : null,
        phone: phone?.trim() || null,
        interested_countries: interested_countries?.length > 0 ? interested_countries : null,
        interested_schools: interested_schools?.length > 0 ? interested_schools : null,
        budget_twd_monthly: budget_twd_monthly ? Number(budget_twd_monthly) : null,
        preferred_duration: preferred_duration || null,
        target_start: target_start?.trim() || null,
        goal: goal || null,
        message: message?.trim() || null,
        source_page: source_page || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 }
      );
    }

    // Async email notification (non-blocking)
    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (resendKey && adminEmail) {
      import("resend").then(({ Resend }) => {
        const resend = new Resend(resendKey);
        const countriesText = interested_countries?.length > 0
          ? interested_countries.join(", ")
          : "未指定";
        resend.emails
          .send({
            from: "StudyGoda <noreply@studygoda.com>",
            to: adminEmail,
            subject: `新諮詢：${name} — LINE: ${line_id || "N/A"}`,
            text: `新的遊學諮詢\n\n姓名：${name}\nLINE ID：${line_id || "未提供"}\nEmail：${email || "未提供"}\n電話：${phone || "未提供"}\n有興趣國家：${countriesText}\n預算：${budget_twd_monthly ? `NT$${budget_twd_monthly}/月` : "未提供"}\n時長：${preferred_duration || "未指定"}\n目標：${goal || "未指定"}\n留言：${message || "無"}\n\n來源頁面：${source_page || "未知"}\nUTM：${utm_source || "-"} / ${utm_medium || "-"} / ${utm_campaign || "-"}`,
          })
          .catch((err) => {
            console.error("Resend email failed:", err);
          });
      }).catch((err) => {
        console.error("Resend module import failed:", err);
      });
    }

    // 7.6: Async LINE notification with new fields
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_ADMIN_USER_ID;

    if (lineToken && lineUserId) {
      import("@/libs/line").then(({ sendLinePushMessage, buildLeadV2FlexMessage }) => {
        const flexMsg = buildLeadV2FlexMessage({
          name,
          lineId: line_id || null,
          email: email || null,
          phone: phone || null,
          interestedCountries: interested_countries || [],
          budget: budget_twd_monthly ? `NT$${Number(budget_twd_monthly).toLocaleString()}/月` : null,
          duration: preferred_duration || null,
          goal: goal || null,
        });
        sendLinePushMessage(lineUserId, flexMsg).catch((err) => {
          console.error("LINE notification failed:", err);
        });
      }).catch((err) => {
        console.error("LINE module import failed:", err);
      });
    }

    return NextResponse.json({ status: "success", id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { error: "Service unavailable" },
      { status: 503 }
    );
  }
}
