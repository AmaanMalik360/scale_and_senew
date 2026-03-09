import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - LINEA Jewelry",
  description: "Privacy policy for LINEA Jewelry",
};

export default function PrivacyPolicy() {
  return (
    <main className="pt-6">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-light text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 15, 2024</p>
        </header>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              make a purchase, or contact us for customer support.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, and communicate with you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
              privacy@lineajewelry.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
