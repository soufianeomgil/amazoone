// app/(root)/contact/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import ContactClient from "./_components/ContactClient";


export const metadata: Metadata = {
  title: "Contact Us | OMGIL",
  description:
    "Contact OMGIL for orders, support, and store info. WhatsApp-first support, fast replies.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(180,69%,97%)] via-white to-white" />
        <div className="relative mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[hsl(178,100%,34%)]/20 bg-[hsl(180,69%,97%)] px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-[hsl(178,100%,34%)]" />
                <p className="text-xs font-semibold text-gray-800">
                  WhatsApp-first support • Fast replies
                </p>
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                Contact <span className="text-[hsl(178,100%,34%)]">OMGIL</span>
              </h1>
              <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed max-w-[58ch]">
                Need help with an order, delivery, or product questions? Reach us
                instantly on WhatsApp, or send a message and we’ll get back to you.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <ContactClient primaryCta />
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <InfoPill title="Replies" value="Usually under 15 min" />
                <InfoPill title="Hours" value="9:00 → 21:00" />
                <InfoPill title="Support" value="WhatsApp + Email" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-gray-50">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-transparent to-transparent" />
                <div className="p-4">
                  {/* Replace this image with your local store photo */}
                  <div className="relative h-[260px] md:h-[320px] rounded-xl overflow-hidden">
                    <Image
                      src="/store.jpg"
                      alt="OMGIL local store"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={false}
                    />
                  </div>

                  <div className="mt-4 rounded-xl bg-white border border-gray-100 p-4">
                    <p className="text-sm font-semibold text-gray-900">Visit our store</p>
                    <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                      Try bags in person, see materials, and get help choosing the perfect
                      fit for your style.
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-gray-50 border border-gray-100 p-2">
                        <p className="text-gray-500">Pickup</p>
                        <p className="font-semibold text-gray-800">Available</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 border border-gray-100 p-2">
                        <p className="text-gray-500">Delivery</p>
                        <p className="font-semibold text-gray-800">Nationwide (MA)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Tip: Replace <span className="font-mono">/store.jpg</span> with your real store image.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: contact cards */}
          <div className="lg:col-span-7 space-y-4">
            <Card>
              <CardHeader
                title="Chat on WhatsApp"
                desc="Fastest way to reach us. Send your order number or a screenshot."
                badge="Recommended"
              />
              <div className="p-4 pt-0">
                <ContactClient />
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
                  <MiniTag>Order support</MiniTag>
                  <MiniTag>Delivery updates</MiniTag>
                  <MiniTag>Product questions</MiniTag>
                  <MiniTag>Returns & exchange</MiniTag>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Email"
                desc="For detailed requests or business inquiries."
              />
              <div className="p-4 pt-0">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      support@omgil.ma
                    </p>
                  </div>
                  <a
                    href="mailto:support@omgil.ma"
                    className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Send email
                  </a>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Replace with your real email when ready.
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Frequently asked"
                desc="Quick answers before you message us."
              />
              <div className="p-4 pt-0 space-y-2">
                <FAQ
                  q="Do you deliver across Morocco?"
                  a="Yes — we ship nationwide. Delivery times depend on your city."
                />
                <FAQ
                  q="Can I pay cash on delivery (COD)?"
                  a="Yes, COD is available for eligible locations."
                />
                <FAQ
                  q="Can I return or exchange?"
                  a="Yes — contact us within the return window and we’ll help you."
                />
              </div>
            </Card>
          </div>

          {/* Right: map + store details */}
          <div className="lg:col-span-5 space-y-4">
            <Card>
              <CardHeader
                title="Store location"
                desc="Add your map embed once you confirm the address."
              />
              <div className="p-4 pt-0">
                {/* Replace with your real Google Maps embed */}
                <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <div className="h-[240px] w-full flex items-center justify-center text-sm text-gray-500">
                    Map placeholder (Google Maps embed)
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-gray-100 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900">OMGIL Store</p>
                  <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    {/* Replace this with your real address */}
                    Your address line here, City, Morocco
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-gray-50 border border-gray-100 p-2">
                      <p className="text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">+212 6 XX XX XX XX</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 border border-gray-100 p-2">
                      <p className="text-gray-500">Hours</p>
                      <p className="font-semibold text-gray-800">9:00 → 21:00</p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <a
                      href="#"
                      className="flex-1 rounded-lg bg-[hsl(178,100%,34%)] px-3 py-2 text-center text-xs font-semibold text-white hover:opacity-95"
                    >
                      Get directions
                    </a>
                    <a
                      href="#"
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-center text-xs font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      Call store
                    </a>
                  </div>

                  <p className="mt-2 text-[11px] text-gray-500">
                    Replace the buttons with real links once your location/phone is final.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title="Social"
                desc="Follow for new arrivals & promos."
              />
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <SocialBtn label="Instagram" hint="@omgil" />
                <SocialBtn label="TikTok" hint="@omgil" />
                <SocialBtn label="Facebook" hint="OMGIL" />
                <SocialBtn label="WhatsApp" hint="Chat now" />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <p className="text-[11px] text-gray-500">{title}</p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {children}
    </div>
  );
}

function CardHeader({
  title,
  desc,
  badge,
}: {
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div className="p-4 border-b border-gray-100 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{desc}</p>
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-[hsl(180,69%,97%)] border border-[hsl(178,100%,34%)]/20 px-2 py-1 text-[10px] font-bold text-[hsl(178,100%,34%)]">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function MiniTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1">
      {children}
    </span>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <summary className="cursor-pointer text-sm font-semibold text-gray-900">
        {q}
      </summary>
      <p className="mt-2 text-xs text-gray-600 leading-relaxed">{a}</p>
    </details>
  );
}

function SocialBtn({ label, hint }: { label: string; hint: string }) {
  return (
    <button
      type="button"
      className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-left hover:bg-white transition"
    >
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </button>
  );
}
