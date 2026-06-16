import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="ef-public-header">
      <Link href="/" className="ef-public-logo">
        <strong>English</strong> Focus<span className="ef-brand-dot">.</span>
      </Link>

      <nav className="ef-public-nav">
        <Link href="/programme">Program</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/login">Login</Link>
        <Link href="/student" className="ef-public-btn primary">Student Area</Link>
      </nav>
    </header>
  );
}
