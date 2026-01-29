import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | OMGIL",
  description: "Frequently asked questions about orders, delivery, payment, and returns at OMGIL.",
};

const FAQS = [
  {
    category: "Orders & Delivery",
    items: [
      {
        q: "Do you deliver all over Morocco?",
        a: "Yes. We deliver to all cities in Morocco. Delivery time depends on your location.",
      },
      {
        q: "How long does delivery take?",
        a: "Usually 24–48 hours for major cities and up to 72 hours for remote areas.",
      },
      {
        q: "Can I choose delivery time?",
        a: "You can coordinate with the delivery agent once they contact you.",
      },
    ],
  },
  {
    category: "Payment",
    items: [
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "Yes. You can pay in cash when your order arrives.",
      },
      {
        q: "Are online payments supported?",
        a: "Currently we focus on Cash on Delivery. Online payment options will be added soon.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "Can I return or exchange a bag?",
        a: "Yes. Contact us within 48 hours of receiving your order and we’ll assist you.",
      },
      {
        q: "What if the product is damaged?",
        a: "If the product arrives damaged, we will replace it or refund you.",
      },
    ],
  },
  {
    category: "Products",
    items: [
      {
        q: "Are your bags original?",
        a: "Yes. We carefully select durable, high-quality bags that meet our standards.",
      },
      {
        q: "Do product images match reality?",
        a: "Yes. All photos are taken from real products. Slight lighting differences may occur.",
      },
    ],
  },
  {
    category: "Support",
    items: [
      {
        q: "How can I contact OMGIL?",
        a: "The fastest way is via WhatsApp. You can also reach us by email.",
      },
      {
        q: "What are your working hours?",
        a: "We respond daily from 9:00 AM to 9:00 PM.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(180,69%,97%)] to-white">
        <div className="mx-auto max-w-[900px] px-4 py-12 text-center">
          <span className="inline-block mb-3 rounded-full bg-[hsl(180,69%,97%)] border border-[hsl(178,100%,34%)]/20 px-4 py-1 text-xs font-semibold text-[hsl(178,100%,34%)]">
            Need help?
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-gray-600 text-sm md:text-base">
            Everything you need to know before ordering from OMGIL.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <section className="mx-auto max-w-[900px] px-4 pb-16">
        <div className="space-y-8">
          {FAQS.map((group) => (
            <div key={group.category}>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {group.category}
              </h2>

              <div className="space-y-3">
                {group.items.map((item, index) => (
                  <details
                    key={index}
                    className="group rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-white"
                  >
                    <summary className="cursor-pointer list-none flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        {item.q}
                      </span>
                      <span className="text-gray-400 group-open:rotate-180 transition">
                        ▼
                      </span>
                    </summary>

                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-[hsl(180,69%,97%)] p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900">
            Still have questions?
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Our team is happy to help you directly.
          </p>

          <a
            href="https://wa.me/212600000000"
            target="_blank"
            className="inline-flex mt-4 items-center justify-center rounded-xl bg-[hsl(178,100%,34%)] px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
          >
            Contact us on WhatsApp →
          </a>
        </div>
      </section>
    </div>
  );
}
