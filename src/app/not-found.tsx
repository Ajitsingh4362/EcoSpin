import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <h1 className="display text-7xl text-purple">Page not found</h1>
      <p className="mt-5 max-w-md text-lg text-ink/80">This page doesn’t exist. Try the price list or book a pickup instead.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/pricing" className="rounded-full bg-purple px-6 py-3 font-semibold text-white">Price list</Link>
        <Link href="/" className="rounded-full px-6 py-3 font-semibold text-purple ring-1 ring-lilac">Home</Link>
      </div>
    </section>
  );
}
