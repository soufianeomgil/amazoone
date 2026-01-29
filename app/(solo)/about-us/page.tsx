import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us | OMGIL",
  description:
    "Discover OMGIL — premium bags, built for everyday life. Learn our story and visit our store.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* soft background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(8,173,168,0.18),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(255,153,0,0.12),_transparent_55%)]" />
        <div className="relative mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-[hsl(178,100%,34%)]" />
                Crafted for everyday confidence
              </p>

              <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                OMGIL — Premium bags,
                <span className="text-[hsl(178,100%,34%)]"> made practical.</span>
              </h1>

              <p className="mt-4 text-gray-600 text-base md:text-lg leading-relaxed max-w-[52ch]">
                We create stylish, durable bags that feel premium without the
                premium price tag. Designed for real life — work, travel, and
                everything in between.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl bg-[hsl(178,100%,34%)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95 transition"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
                >
                  Contact Us
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { t: "Quality", d: "Durable materials" },
                  { t: "Value", d: "Fair pricing" },
                  { t: "Style", d: "Clean design" },
                  { t: "Support", d: "Fast replies" },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-2xl border border-gray-100 bg-white/70 p-3 shadow-sm"
                  >
                    <p className="text-sm font-bold text-gray-900">{x.t}</p>
                    <p className="text-xs text-gray-500 mt-1">{x.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image card */}
            <div className="relative">
              <div className="relative rounded-3xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                {/* REPLACE with your store image */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src="/me2.jpeg"
                    alt="OMGIL local store"
                    fill
                   className="object-cover"
                    priority
                  />
                </div>

                <div className="p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Visit our store
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    See the bags in-person, feel the materials, and get help
                    choosing the perfect one.
                  </p>
                </div>
              </div>

              {/* Floating mini card */}
              <div className="absolute -bottom-6 -left-6 hidden md:block">
                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
                  <p className="text-xs text-gray-500">Customers love</p>
                  <p className="text-sm font-bold text-gray-900">
                    durability + clean look
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY + GALLERY */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Our story
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              OMGIL started locally with a focus on what people actually need:
              bags that look premium, hold up daily, and stay affordable. We
              test materials, improve stitching, and obsess over details — so
              you don’t have to.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  title: "Design-first",
                  desc: "Minimal, modern, and easy to match with any outfit.",
                },
                {
                  title: "Built to last",
                  desc: "Strong stitching, practical compartments, durable fabrics.",
                },
                {
                  title: "Local & real",
                  desc: "A local store you can visit, with real support behind every order.",
                },
              ].map((i) => (
                <div
                  key={i.title}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <p className="text-sm font-bold text-gray-900">{i.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="relative col-span-2 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-[16/9]">
                <Image
                  src="/me1.jpeg"
                  alt="Store view"
                  fill
                 className="object-cover"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-square">
                <Image
                  src="/me3.jpeg"
                  alt="Bags display"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="relative aspect-square">
                <Image
                  src="/me1.jpeg"
                  alt="Store shelves"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="col-span-2 rounded-3xl border border-gray-200 bg-white shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900">Our promise</p>
              <p className="mt-2 text-sm text-gray-600">
                If it doesn’t feel right, we’ll help you exchange it. We care
                more about long-term trust than a quick sale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">
                Ready to find your next favorite bag?
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Explore OMGIL bags — premium feel, everyday function.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-[hsl(178,100%,34%)] px-5 py-3 text-sm font-semibold text-white shadow hover:opacity-95 transition"
              >
                Browse products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
              >
                Ask on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
