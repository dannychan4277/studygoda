import { NextResponse } from "next/server";
import { Resend } from "resend";

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

  const { name, email, phone, program_id, preferred_weeks, message, website } =
    body;

  // D5: Honeypot — if website field is filled, it's a bot
  if (website) {
    return NextResponse.json({ status: "success", id: "honeypot" });
  }

  // Validation
  const errors = [];
  if (!name?.trim()) errors.push({ field: "name", message: "姓名為必填" });
  if (!email?.trim()) {
    errors.push({ field: "email", message: "Email 為必填" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: "email", message: "Email 格式不正確" });
  }
  if (!preferred_weeks || preferred_weeks < 1) {
    errors.push({ field: "preferred_weeks", message: "請選擇預計週數" });
  }
  if (message && message.length > 1000) {
    errors.push({ field: "message", message: "留言不能超過 1000 字" });
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Supabase insert
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Duplicate check: same email + program_id within 24 hours
    if (program_id) {
      const twentyFourHoursAgo = new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString();

      const { data: existing } = await supabase
        .from("leads")
        .select("id")
        .eq("email", email)
        .eq("program_id", program_id)
        .gte("created_at", twentyFourHoursAgo)
        .limit(1);

      if (existing && existing.length > 0) {
        return NextResponse.json({ status: "already_submitted" });
      }
    }

    // Insert
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim() || null,
        program_id: program_id || null,
        preferred_weeks,
        message: message?.trim() || null,
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
      const resend = new Resend(resendKey);
      resend.emails
        .send({
          from: "StudyGoda <noreply@studygoda.com>",
          to: adminEmail,
          subject: `新諮詢：${name} - ${email}`,
          text: `新的遊學諮詢\n\n姓名：${name}\nEmail：${email}\n電話：${phone || "未提供"}\n預計週數：${preferred_weeks}\n留言：${message || "無"}\n\nProgram ID: ${program_id || "未指定"}`,
        })
        .catch((err) => {
          console.error("Resend email failed:", err);
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
