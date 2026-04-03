import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSchoolBySlug, getAllSchools } from "@/libs/data/schools";
import { getFeeColorClass, formatUSD, formatWeeklyTWD } from "@/libs/utils";
import LeadForm from "@/components/LeadForm";
import FloatingCTA from "@/components/FloatingCTA";
import CompareButton from "@/components/CompareButton";
import FloatingCompareBar from "@/components/FloatingCompareBar";
import config from "@/config";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const schools = await getAllSchools();
    return (schools || [])
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, 50)
      .map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const school = await getSchoolBySlug(slug);
    if (!school) return {};

    const lowestFee = school.min_price_per_week;
    const feeText = lowestFee ? `週費 ${formatUSD(lowestFee)} USD 起` : "";
    const countryName = config.countryNames[school.country] || school.country;

    return {
      title: `${school.name} — ${school.city}, ${countryName} 語言學校`,
      description: `${school.name}，位於${school.city}。${feeText}。${(school.description_zh || school.description || "").slice(0, 100)}`,
      openGraph: {
        title: `${school.name} | StudyGoda`,
        description: `${feeText} · ${school.city}, ${countryName}`,
        images: school.photo_url
          ? [{ url: school.photo_url, width: 1200, height: 630 }]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function SchoolDetailPage({ params }) {
  const { slug } = await params;
  let school;

  try {
    school = await getSchoolBySlug(slug);
  } catch {
    notFound();
  }

  if (!school) notFound();

  const courses = school.courses || [];
  const countryName = config.countryNames[school.country] || school.country;
  const countryFlag = config.countryFlags[school.country] || "";
  const lowestFee = school.min_price_per_week;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name,
    description: school.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: school.address,
      addressLocality: school.city,
      addressRegion: school.state,
      addressCountry: school.country,
    },
    ...(school.lat &&
      school.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: school.lat,
          longitude: school.lng,
        },
      }),
    ...(school.website && { url: school.website }),
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
          src={
            school.photo_url ||
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920"
          }
          alt={school.name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(transparent 30%, rgba(26,26,46,0.92) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:px-8">
          <div className="max-w-[1120px] mx-auto">
            {school.brand && (
              <span
                className="inline-block px-2.5 py-0.5 text-xs font-display font-semibold rounded-full mb-2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {school.brand}
              </span>
            )}
            <h1
              className="font-display font-extrabold text-white text-2xl md:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {school.name}
            </h1>
            {school.name_zh && (
              <p className="text-white/70 text-sm mt-1">{school.name_zh}</p>
            )}
            <div className="mt-2 flex items-center gap-3 flex-wrap text-white/80 text-sm">
              <span>
                {countryFlag} {school.city}, {countryName}
              </span>
              {lowestFee && (
                <span className="font-mono font-semibold text-white">
                  {formatWeeklyTWD(lowestFee)} 起
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1120px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-10">
            {/* Quick info bar */}
            <div
              className="p-5"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  {lowestFee && (
                    <>
                      <span
                        className={`font-mono font-semibold text-[32px] ${getFeeColorClass(lowestFee)}`}
                      >
                        {formatWeeklyTWD(lowestFee)}
                      </span>
                      <span
                        className="block text-[13px] mt-1"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        ({formatUSD(lowestFee)} USD/週起)
                      </span>
                    </>
                  )}
                </div>
                <CompareButton slug={slug} size="md" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {school.max_class_size && (
                  <InfoItem label="最大班級人數" value={`${school.max_class_size} 人`} />
                )}
                {school.avg_class_size && (
                  <InfoItem label="平均班級人數" value={`${school.avg_class_size} 人`} />
                )}
                {school.min_age && (
                  <InfoItem label="最低年齡" value={`${school.min_age} 歲`} />
                )}
                {school.f1_visa !== null && school.f1_visa !== undefined && (
                  <InfoItem label="F1 簽證" value={school.f1_visa ? "支援" : "不支援"} />
                )}
                {school.accommodation_types?.length > 0 && (
                  <InfoItem
                    label="住宿選擇"
                    value={school.accommodation_types.join("、")}
                  />
                )}
                {school.duration_range && (
                  <InfoItem label="課程週數" value={`${school.duration_range} 週`} />
                )}
              </div>

              {/* Features */}
              {school.features?.length > 0 && (
                <div className="mt-4">
                  <span
                    className="block text-xs font-display font-bold uppercase tracking-wider mb-2"
                    style={{
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    特色
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {school.features.map((f) => (
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

              {/* Accreditations */}
              {school.accreditations?.length > 0 && (
                <div className="mt-4">
                  <span
                    className="block text-xs font-display font-bold uppercase tracking-wider mb-2"
                    style={{
                      color: "var(--color-text-muted)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    認證
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {school.accreditations.map((a) => (
                      <span
                        key={a}
                        className="px-2.5 py-1 text-xs font-display font-medium rounded-full"
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "white",
                          opacity: 0.85,
                        }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {(school.description_zh || school.description) && (
              <div>
                <h2
                  className="font-display font-bold text-xl mb-3"
                  style={{ color: "var(--color-text)" }}
                >
                  關於這間學校
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {school.description_zh || school.description}
                </p>
              </div>
            )}

            {/* Fee table (3.2) */}
            {courses.length > 0 && (
              <div>
                <h2
                  className="font-display font-bold text-xl mb-4"
                  style={{ color: "var(--color-text)" }}
                >
                  課程費用一覽
                </h2>
                <div
                  className="overflow-x-auto"
                  style={{
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "var(--color-sunken)",
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <th
                          className="text-left px-4 py-3 font-display font-semibold"
                          style={{ color: "var(--color-text)" }}
                        >
                          課程名稱
                        </th>
                        <th
                          className="text-center px-3 py-3 font-display font-semibold whitespace-nowrap"
                          style={{ color: "var(--color-text)" }}
                        >
                          時數/週
                        </th>
                        <th
                          className="text-center px-3 py-3 font-display font-semibold whitespace-nowrap"
                          style={{ color: "var(--color-text)" }}
                        >
                          堂數/週
                        </th>
                        <th
                          className="text-center px-3 py-3 font-display font-semibold whitespace-nowrap"
                          style={{ color: "var(--color-text)" }}
                        >
                          週數
                        </th>
                        <th
                          className="text-right px-4 py-3 font-display font-semibold whitespace-nowrap"
                          style={{ color: "var(--color-text)" }}
                        >
                          週費
                        </th>
                        <th
                          className="text-right px-3 py-3 font-display font-semibold whitespace-nowrap hidden sm:table-cell"
                          style={{ color: "var(--color-text)" }}
                        >
                          註冊費
                        </th>
                        <th
                          className="text-right px-3 py-3 font-display font-semibold whitespace-nowrap hidden sm:table-cell"
                          style={{ color: "var(--color-text)" }}
                        >
                          教材費
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses
                        .sort(
                          (a, b) =>
                            (a.price_per_week_usd || 0) -
                            (b.price_per_week_usd || 0)
                        )
                        .map((course, i) => (
                          <tr
                            key={course.id}
                            style={{
                              backgroundColor:
                                i % 2 === 0
                                  ? "var(--color-elevated)"
                                  : "var(--color-sunken)",
                              borderBottom: "1px solid var(--color-border)",
                            }}
                          >
                            <td
                              className="px-4 py-3 font-display font-medium"
                              style={{ color: "var(--color-text)" }}
                            >
                              {course.name}
                              {course.name_zh && (
                                <span
                                  className="block text-xs mt-0.5"
                                  style={{ color: "var(--color-text-muted)" }}
                                >
                                  {course.name_zh}
                                </span>
                              )}
                            </td>
                            <td
                              className="text-center px-3 py-3 font-mono"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {course.hours_per_week || "—"}
                            </td>
                            <td
                              className="text-center px-3 py-3 font-mono"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {course.lessons_per_week || "—"}
                            </td>
                            <td
                              className="text-center px-3 py-3 font-mono whitespace-nowrap"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {course.min_weeks && course.max_weeks
                                ? `${course.min_weeks}–${course.max_weeks}`
                                : course.min_weeks || "—"}
                            </td>
                            <td className="text-right px-4 py-3">
                              {course.price_per_week_usd ? (
                                <span
                                  className={`font-mono font-semibold ${getFeeColorClass(course.price_per_week_usd)}`}
                                >
                                  {formatUSD(course.price_per_week_usd)}
                                </span>
                              ) : (
                                <span style={{ color: "var(--color-text-muted)" }}>
                                  —
                                </span>
                              )}
                            </td>
                            <td
                              className="text-right px-3 py-3 font-mono hidden sm:table-cell"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {course.registration_fee
                                ? formatUSD(course.registration_fee)
                                : "—"}
                            </td>
                            <td
                              className="text-right px-3 py-3 font-mono hidden sm:table-cell"
                              style={{ color: "var(--color-text-secondary)" }}
                            >
                              {course.material_fee
                                ? formatUSD(course.material_fee)
                                : "—"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <p
                  className="mt-2 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  費用以 USD 計價，實際費用請以學校公告為準
                </p>
              </div>
            )}

            {/* Course detail cards (3.3) */}
            {courses.length > 0 && (
              <div>
                <h2
                  className="font-display font-bold text-xl mb-4"
                  style={{ color: "var(--color-text)" }}
                >
                  課程詳情
                </h2>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-5"
                      style={{
                        backgroundColor: "var(--color-elevated)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3
                            className="font-display font-bold text-base"
                            style={{ color: "var(--color-text)" }}
                          >
                            {course.name}
                          </h3>
                          {course.name_zh && (
                            <p
                              className="text-sm mt-0.5"
                              style={{ color: "var(--color-text-muted)" }}
                            >
                              {course.name_zh}
                            </p>
                          )}
                        </div>
                        {course.price_per_week_usd && (
                          <span
                            className={`font-mono font-semibold text-lg whitespace-nowrap ${getFeeColorClass(course.price_per_week_usd)}`}
                          >
                            {formatUSD(course.price_per_week_usd)}/週
                          </span>
                        )}
                      </div>

                      {course.course_type && (
                        <span
                          className="inline-block mt-2 px-2.5 py-0.5 text-xs font-display font-medium rounded-full"
                          style={{
                            backgroundColor: "var(--color-sunken)",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {course.course_type}
                        </span>
                      )}

                      {course.description && (
                        <p
                          className="mt-3 text-sm leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {course.description}
                        </p>
                      )}

                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        {course.hours_per_week && (
                          <CourseDetail
                            label="時數/週"
                            value={`${course.hours_per_week} 小時`}
                          />
                        )}
                        {course.lessons_per_week && (
                          <CourseDetail
                            label="堂數/週"
                            value={`${course.lessons_per_week} 堂`}
                          />
                        )}
                        {(course.min_weeks || course.max_weeks) && (
                          <CourseDetail
                            label="課程長度"
                            value={
                              course.min_weeks && course.max_weeks
                                ? `${course.min_weeks}–${course.max_weeks} 週`
                                : `${course.min_weeks || course.max_weeks} 週`
                            }
                          />
                        )}
                        {course.min_level && (
                          <CourseDetail label="最低程度" value={course.min_level} />
                        )}
                        {course.min_age && (
                          <CourseDetail
                            label="最低年齡"
                            value={`${course.min_age} 歲`}
                          />
                        )}
                        {course.registration_fee && (
                          <CourseDetail
                            label="註冊費"
                            value={formatUSD(course.registration_fee)}
                          />
                        )}
                        {course.material_fee && (
                          <CourseDetail
                            label="教材費"
                            value={formatUSD(course.material_fee)}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location section (3.4) */}
            <div>
              <h2
                className="font-display font-bold text-xl mb-4"
                style={{ color: "var(--color-text)" }}
              >
                位置資訊
              </h2>
              <div
                className="p-5"
                style={{
                  backgroundColor: "var(--color-elevated)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex gap-2">
                    <span style={{ color: "var(--color-text-muted)" }}>城市</span>
                    <span
                      className="font-display font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      {school.city}
                      {school.state ? `, ${school.state}` : ""}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span style={{ color: "var(--color-text-muted)" }}>國家</span>
                    <span
                      className="font-display font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      {countryFlag} {countryName}
                    </span>
                  </div>
                  {school.address && (
                    <div className="flex gap-2">
                      <span style={{ color: "var(--color-text-muted)" }}>地址</span>
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {school.address}
                      </span>
                    </div>
                  )}
                  {school.website && (
                    <div className="flex gap-2">
                      <span style={{ color: "var(--color-text-muted)" }}>官網</span>
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {school.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    </div>
                  )}
                </div>

                {/* Map embed */}
                {school.lat && school.lng ? (
                  <div
                    className="overflow-hidden"
                    style={{ borderRadius: "var(--radius-md)" }}
                  >
                    <iframe
                      title={`${school.name} 地圖`}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${school.lng - 0.01},${school.lat - 0.01},${school.lng + 0.01},${school.lat + 0.01}&layer=mapnik&marker=${school.lat},${school.lng}`}
                    />
                    <a
                      href={`https://www.google.com/maps?q=${school.lat},${school.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-xs underline"
                      style={{ color: "var(--color-primary)" }}
                    >
                      在 Google Maps 開啟
                    </a>
                  </div>
                ) : (
                  <p
                    className="text-sm italic"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    地圖資訊暫無
                  </p>
                )}
              </div>
            </div>

            {/* Lead form (mobile: inline) */}
            <div className="lg:hidden">
              <LeadForm programId={school.id} programName={school.name} />
            </div>
          </div>

          {/* Sidebar (3.6) */}
          <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* Lead form (desktop) */}
              <div className="hidden lg:block">
                <LeadForm programId={school.id} programName={school.name} />
              </div>

              {/* Quick contact CTA card */}
              <div
                className="p-5"
                style={{
                  backgroundColor: "var(--color-elevated)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h3
                  className="font-display font-bold text-base mb-2"
                  style={{ color: "var(--color-text)" }}
                >
                  對 {school.name} 有興趣？
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  留下資料，顧問免費幫你評估
                </p>
                <Link
                  href={`/contact?school=${slug}`}
                  className="block w-full text-center py-3 rounded-full font-display font-semibold text-sm min-h-[44px]"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                  }}
                >
                  免費諮詢
                </Link>
              </div>

              {/* School quick facts sidebar */}
              {school.course_types?.length > 0 && (
                <div
                  className="p-5"
                  style={{
                    backgroundColor: "var(--color-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <h3
                    className="font-display font-bold text-base mb-3"
                    style={{ color: "var(--color-text)" }}
                  >
                    提供的課程類型
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {school.course_types.map((ct) => (
                      <span
                        key={ct}
                        className="px-2.5 py-1 text-xs font-display font-medium rounded-full"
                        style={{
                          backgroundColor: "var(--color-sunken)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {ct}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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

/** Small info item used in the quick-info grid */
function InfoItem({ label, value }) {
  return (
    <div>
      <span
        className="block text-xs font-display font-bold uppercase tracking-wider mb-1"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
      >
        {label}
      </span>
      <span style={{ color: "var(--color-text)" }}>{value}</span>
    </div>
  );
}

/** Small detail item used in course cards */
function CourseDetail({ label, value }) {
  return (
    <div>
      <span
        className="block text-xs font-display font-bold uppercase tracking-wider mb-0.5"
        style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
      >
        {label}
      </span>
      <span className="font-mono text-sm" style={{ color: "var(--color-text)" }}>
        {value}
      </span>
    </div>
  );
}
