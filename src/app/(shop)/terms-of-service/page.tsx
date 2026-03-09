import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - LINEA Jewelry",
  description: "Terms of service for LINEA Jewelry",
};

export default function TermsOfService() {
  return (
    <main className="pt-6">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-light text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 15, 2024</p>
        </header>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using LINEA Jewelry's website and services, you accept and agree 
              to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of the materials on LINEA Jewelry's 
              website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Product Information</h2>
            <p className="text-muted-foreground mb-4">
              We strive to be as accurate as possible in the descriptions of our products. However, 
              we do not warrant that product descriptions, colors, or other content of the website 
              are accurate, complete, reliable, current, or error-free.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Returns and Refunds</h2>
            <p className="text-muted-foreground mb-4">
              Our return policy allows for returns within 30 days of purchase. Items must be in 
              their original condition with all tags and packaging intact.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-light text-foreground mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              Questions about the Terms of Service should be sent to: legal@lineajewelry.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
