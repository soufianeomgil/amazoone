import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | OMGIL",
  description: "Learn how OMGIL collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b bg-[hsl(180,69%,97%)]">
        <div className="mx-auto max-w-[900px] px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[900px] px-4 py-12 space-y-8 text-gray-700 text-sm leading-relaxed">
        <p>
          At <strong>OMGIL</strong>, your privacy is important to us. This Privacy
          Policy explains how we collect, use, and protect your personal
          information when you use our website or services.
        </p>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name, phone number, and delivery address</li>
            <li>Email address (if provided)</li>
            <li>Order and purchase history</li>
            <li>Device and browser information</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and deliver your orders</li>
            <li>To contact you about your order</li>
            <li>To improve our products and services</li>
            <li>To prevent fraud and abuse</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Data Protection</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information. Your data is never sold to third parties.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Cookies</h2>
          <p>
            We use cookies to improve your browsing experience and analyze
            website traffic. You can disable cookies in your browser settings.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Your Rights</h2>
          <p>
            You have the right to access, update, or request deletion of your
            personal data by contacting us.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, contact us via
            WhatsApp or email.
          </p>
        </div>
      </section>
    </div>
  );
}
