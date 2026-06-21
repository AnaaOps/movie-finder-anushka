import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl tracking-marquee text-marquee transition group-hover:text-ink sm:text-3xl">
            REEL
          </span>
          <span className="font-display text-2xl tracking-marquee text-ink sm:text-3xl">
            FIND
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <Link href="/" className="transition hover:text-ink">
            Browse
          </Link>
          <Link href="/favorites" className="transition hover:text-ink">
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}
