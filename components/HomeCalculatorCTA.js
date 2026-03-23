import Link from "next/link";
import AnimatedSection from "./AnimatedSection";

export default function HomeCalculatorCTA() {
  return (
    <AnimatedSection
      className="py-16 md:py-20 px-6"
      style={{ backgroundColor: "var(--color-primary)", color: "white" }}
    >
      <div className="max-w-[1120px] mx-auto text-center">
        <h2 className="font-display font-bold text-[28px] md:text-[36px] mb-4">
          算算你的遊學預算
        </h2>
        <p className="text-base md:text-lg opacity-80 mb-8 max-w-xl mx-auto" style={{ lineHeight: 1.6 }}>
          選學校、設週數，即時算出學費＋生活費＋機票的完整花費。
        </p>
        <Link
          href="/calculator"
          className="inline-flex items-center font-display font-semibold text-base px-8 py-4 transition-transform hover:scale-105"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
            borderRadius: "var(--radius-md)",
            minHeight: "56px",
          }}
        >
          開始計算 →
        </Link>
      </div>
    </AnimatedSection>
  );
}
