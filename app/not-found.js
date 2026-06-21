import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-display text-lg tracking-marquee text-ink">
        404 — REEL NOT FOUND
      </p>
      <Link href="/" className="text-sm text-marquee underline">
        Back to Browse
      </Link>
    </div>
  );
}
