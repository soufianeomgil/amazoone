import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | OMGIL",
  description: "Terms and conditions for using OMGIL and placing orders.",
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b bg-[hsl(180,69%,97%)]">
        <div className="mx-auto max-w-[900px] px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Please read these terms carefully before using our website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[900px] px-4 py-12 space-y-8 text-gray-700 text-sm leading-relaxed">
        <p>
          By accessing or using <strong>OMGIL</strong>, you agree to be bound by
          these Terms & Conditions.
        </p>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Use of the Website</h2>
          <p>
            You agree to use this website only for lawful purposes and not to
            misuse our services.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Orders</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All orders are subject to availability</li>
            <li>We reserve the right to refuse or cancel any order</li>
            <li>Prices may change without notice</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Payment</h2>
          <p>
            Payment is made using Cash on Delivery unless otherwise stated.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Delivery</h2>
          <p>
            Delivery times are estimates and may vary depending on location and
            external factors.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Returns & Refunds</h2>
          <p>
            Returns and exchanges are accepted according to our return policy.
            Please contact us within 48 hours of receiving your order.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Limitation of Liability</h2>
          <p>
            OMGIL is not responsible for any indirect damages resulting from the
            use of our website or products.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Changes to Terms</h2>
          <p>
            We may update these Terms & Conditions at any time. Continued use of
            the website means you accept the updated terms.
          </p>
        </div>
      </section>
    </div>
  );
}
