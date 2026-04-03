import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "免費諮詢 — StudyGoda",
  description:
    "填寫表單，我們的遊學顧問會在 24 小時內透過 LINE 聯繫你，提供免費的語言學校推薦與費用估算。",
  alternates: {
    canonical: "https://studygoda.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-[640px] mx-auto">
        <Suspense
          fallback={
            <div
              className="p-6 space-y-4"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="skeleton h-7 w-32" />
              <div className="skeleton h-4 w-64" />
              <div className="skeleton h-11 w-full" />
              <div className="skeleton h-11 w-full" />
              <div className="skeleton h-11 w-full" />
            </div>
          }
        >
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
