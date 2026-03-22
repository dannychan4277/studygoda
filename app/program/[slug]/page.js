import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPrograms, getProgramBySlug } from "@/libs/data/programs";
import { getFeeColorClass, formatUSD } from "@/libs/utils";
import TestimonialQuote from "@/components/TestimonialQuote";
import AffiliateBlock from "@/components/AffiliateBlock";
import LeadForm from "@/components/LeadForm";
import FloatingCTA from "@/components/FloatingCTA";
import CompareButton from "@/components/CompareButton";
import FloatingCompareBar from "@/components/FloatingCompareBar";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const programs = await getAllPrograms();
    return (programs || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const program = await getProgramBySlug(slug);
    if (!program) return {};

    return {
      title: `${program.name} — ${program.city} 語言學校`,
      description: `${program.name}，位於${program.city}。週費 $${program.weekly_fee_usd} USD，${program.course_type}。${program.description?.slice(0, 100)}`,
      openGraph: {
        title: `${program.name} | StudyGoda`,
        description: `週費 $${program.weekly_fee_usd} USD · ${program.course_type} · ${program.city}`,
        images: [{ url: `/api/og/${slug}`, width: 1200, height: 630 }],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProgramDetailPage({ params }) {
  const { slug } = await params;
  let program;

  try {
    program = await getProgramBySlug(slug);
  } catch {
    notFound();
  }

  if (!program) notFound();

  const feeClass = getFeeColorClass(program.weekly_fee_usd);
  const cityGuide = program.cityGuide;
  const testimonials = program.testimonials || [];

  const livingCostTotal = cityGuide
    ? cityGuide.weekly_food_usd + cityGuide.weekly_transport_usd + cityGuide.weekly_misc_usd
    : 0;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: program.name,
    description: program.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: program.city,
      addressCountry: program.country,
    },
    ...(program.google_rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: program.google_rating,
        bestRating: 5,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero photo */}
      <div className="relative w-full" style={{ height: "45vh", minHeight: "300px" }}>
        <Image
          src={program.photo_url || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920"}
          alt={program.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(transparent 30%, rgba(26,26,46,0.92) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:px-8">
          <div className="max-w-[1120px] mx-auto">
            <h1
              className="font-display font-extrabold text-white text-2xl md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {program.name}
            </h1>
            <div className="mt-2 flex items-center gap-3 flex-wrap text-white/80 text-sm">
              <span>📍 {program.city}, {program.country}</span>
              {program.google_rating > 0 && <span>★ {program.google_rating}</span>}
              <span>{program.course_type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1120px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-8">
            {/* Fee & basic info */}
            <div
              className="p-6"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className={`font-mono font-semibold text-[32px] ${feeClass}`}>
                  {formatUSD(program.weekly_fee_usd)}/週
                </span>
                <CompareButton slug={slug} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs font-display font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
                    課程類型
                  </span>
                  <span style={{ color: "var(--color-text)" }}>{program.course_type}</span>
                </div>
                <div>
                  <span className="block text-xs font-display font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
                    週數
                  </span>
                  <span style={{ color: "var(--color-text)" }}>{program.min_weeks}-{program.max_weeks} 週</span>
                </div>
                {program.accommodation && (
                  <div>
                    <span className="block text-xs font-display font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
                      住宿
                    </span>
                    <span style={{ color: "var(--color-text)" }}>{program.accommodation}</span>
                  </div>
                )}
                {program.google_rating > 0 && (
                  <div>
                    <span className="block text-xs font-display font-bold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
                      Google 評價
                    </span>
                    <span style={{ color: "var(--color-text)" }}>★ {program.google_rating} / 5</span>
                  </div>
                )}
              </div>

              {/* Facilities */}
              {program.facilities?.length > 0 && (
                <div className="mt-4">
                  <span className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
                    設施
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {program.facilities.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 text-xs font-display font-medium rounded-full"
                        style={{
                          backgroundColor: "var(--color-sunken)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {program.description && (
              <div>
                <h2 className="font-display font-bold text-xl mb-3" style={{ color: "var(--color-text)" }}>
                  關於這間學校
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {program.description}
                </p>
              </div>
            )}

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-xl mb-4" style={{ color: "var(--color-text)" }}>
                  學員心得
                </h2>
                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <TestimonialQuote key={t.id} testimonial={t} />
                  ))}
                </div>
              </div>
            )}

            {/* Lead form (desktop: inline, mobile: scrolled to via floating CTA) */}
            <div className="lg:hidden">
              <LeadForm programId={program.id} programName={program.name} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Lead form (desktop) */}
              <div className="hidden lg:block">
                <LeadForm programId={program.id} programName={program.name} />
              </div>

              {/* City living cost */}
              {cityGuide && (
                <div
                  className="p-5"
                  style={{
                    backgroundColor: "var(--color-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <h3 className="font-display font-bold text-base mb-3" style={{ color: "var(--color-text)" }}>
                    在{program.city}的生活費
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-text-secondary)" }}>餐飲/週</span>
                      <span className="font-mono font-medium" style={{ color: "var(--color-text)" }}>
                        {formatUSD(cityGuide.weekly_food_usd)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-text-secondary)" }}>交通/週</span>
                      <span className="font-mono font-medium" style={{ color: "var(--color-text)" }}>
                        {formatUSD(cityGuide.weekly_transport_usd)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-text-secondary)" }}>雜支/週</span>
                      <span className="font-mono font-medium" style={{ color: "var(--color-text)" }}>
                        {formatUSD(cityGuide.weekly_misc_usd)}
                      </span>
                    </div>
                    <div
                      className="flex justify-between pt-2 mt-2 font-display font-semibold"
                      style={{ borderTop: "1px solid var(--color-border)" }}
                    >
                      <span style={{ color: "var(--color-text)" }}>合計/週</span>
                      <span className="font-mono" style={{ color: "var(--color-primary)" }}>
                        {formatUSD(livingCostTotal)}
                      </span>
                    </div>
                  </div>
                  {(cityGuide.flight_twd_min || cityGuide.flight_twd_max) && (
                    <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      機票參考：NT${cityGuide.flight_twd_min?.toLocaleString()} – NT${cityGuide.flight_twd_max?.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Affiliate */}
              <AffiliateBlock />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile floating CTA */}
      <FloatingCTA />
      <FloatingCompareBar />
    </>
  );
}
