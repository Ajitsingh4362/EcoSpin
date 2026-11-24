import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="main" className="flex-1">
    <section className="mx-auto max-w-6xl px-5 pt-40 pb-28">
      <h1 className="display text-7xl text-purple">Page not found</h1>
      <p className="mt-5 max-w-md text-lg text-ink/80">This page doesn’t exist. Try the price list or book a pickup instead.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/pricing" className="rounded-full bg-purple px-6 py-3 font-semibold text-white">Price list</Link>
        <Link href="/" className="rounded-full px-6 py-3 font-semibold text-purple ring-1 ring-lilac">Home</Link>
      </div>
    </section>
    </main>
    <Footer />
    </>
  );
}
