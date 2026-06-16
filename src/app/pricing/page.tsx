import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function PricingPage() {
  return (
    <div className="ef-public">
      <PublicHeader />
      <main className="ef-public-hero">
        <section>
          <h1 className="ef-public-title">Simple plans for <span>English learning.</span></h1>
          <p className="ef-public-text">Starter, Standard and Premium plans will be connected later.</p>
          <Link href="/login" className="ef-public-btn primary">Choose a Plan</Link>
        </section>
      </main>
    </div>
  );
}
